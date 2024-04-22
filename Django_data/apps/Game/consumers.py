import json, asyncio, time
from channels.generic.websocket import AsyncWebsocketConsumer
from .pong import Pong, ai_brain
from asgiref.sync import sync_to_async

class SoloPongConsumer(AsyncWebsocketConsumer):
	async def connect(self):
		self.roomGroupName = "pong_game"
		self.room_group_name = f'game_{self.roomGroupName}'
		await self.channel_layer.group_add(
			self.room_group_name ,
			self.channel_name
		)
		await self.accept()
		# self.pong = Pong(2 , 20 , 10, True)
		# asyncio.create_task(self.runGame())

	async def disconnect(self , close_code):
		self.pong.running = False
		await self.channel_layer.group_discard(
			self.room_group_name ,
			self.channel_name
		)

	async def receive(self, text_data):
		data = json.loads(text_data)
		message = data["message"]
		if message == "up" and self.pong.player_pos[1] > 0:
			self.pong.player_pos[1] -= self.pong.player_speed
		elif message == "down" and self.pong.player_pos[1] < 900:
			self.pong.player_pos[1] += self.pong.player_speed
		elif message == "space" and self.pong.engage > 0:
			self.pong.engage = 0
		elif message == "settings":
			self.ia = True
			if data["type"] == "local":
				self.ia = False
			self.pong = Pong(data["point_limit"], data["difficulty"], data["powerup"])
			asyncio.create_task(self.runGame())

	async def sendUpdateGame(self):
		try :
			await self.send(text_data = json.dumps({
						"paddleL" : self.pong.player_pos[0]/900 ,
						"paddleR" : self.pong.player_pos[1]/900 ,
						"ballX" : self.pong.ball_pos[0]/1200 ,
						"ballY" : self.pong.ball_pos[1]/900 ,
						"score1" : self.pong.point[0] ,
						"score2" : self.pong.point[1] ,
						"ballsize" : self.pong.ball_size/900 ,
						"paddle1size" : self.pong.player_size[0]/900 ,
						"paddle2size" : self.pong.player_size[1]/900 ,
						"powerupY" : self.pong.powerup_pos[1]/900 ,
						"powerupsize" : self.pong.powerup_size/900 ,
						"time" : self.pong.time ,
						"message" : "game_state"}))
		except Exception as e:
			print(e)

	async def runGame(self):
		loop = time.time()
		while self.pong.running:
			loop += 1/240
			# ia move
			if self.ia:
				self.pong.player_pos[0] = ai_brain(self.pong, 1, 20)
			# ball move
			self.pong.ball_walk()
			self.pong.powerup_run()
			# paddle bounce
			if self.pong.ball_pos[0] < 60 and self.pong.ball_speed[0] < 0:
				self.pong.paddle_bounce(0)
			elif self.pong.ball_pos[0] > 1140 and self.pong.ball_speed[0] > 0:
				self.pong.paddle_bounce(1)
			# wall bounce
			if self.pong.ball_pos[1] < 5 and self.pong.ball_speed[1] < 0 or self.pong.ball_pos[1] > 895 and self.pong.ball_speed[1] > 0:
				self.pong.ball_speed[1] *= -1
				self.pong.ball_bonce += 1
			# point
			if self.pong.ball_pos[0] > 1200:
				self.pong.update_score(0)
			if self.pong.ball_pos[0] < 0:
				self.pong.update_score(1)
			await self.sendUpdateGame()
			await asyncio.sleep(loop - time.time())
