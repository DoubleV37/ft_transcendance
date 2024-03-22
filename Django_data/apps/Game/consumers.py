import json, asyncio
from channels.generic.websocket import AsyncWebsocketConsumer
from .pong import Pong, ai_brain

class SoloPongConsumer(AsyncWebsocketConsumer):
	async def connect(self):
		self.roomGroupName = "pong_game"
		await self.channel_layer.group_add(
			self.roomGroupName ,
			self.channel_name
		)
		await self.accept()
		self.pong = Pong(1 , 2 , 10)

		asyncio.create_task(self.runGame())

	async def disconnect(self , close_code):
		await self.channel_layer.group_discard(
			self.roomGroupName ,
			self.channel_layer
		)

	async def receive(self, text_data):
		data = json.loads(text_data)
		message = data["message"]
		username = data["username"]
		if message == "up":
			self.pong.player_pos[1] = self.pong.player_pos[1] - self.pong.player_speed
		elif message == "down":
			self.pong.player_pos[1] = self.pong.player_pos[1] + self.pong.player_speed

	async def sendMessage(self):
		await self.send(text_data = json.dumps({"paddleL" : self.pong.player_pos[0]/900 ,
												"paddleR" : self.pong.player_pos[1]/900 ,
												"ballX" : self.pong.ball_pos[0]/1200 ,
												"ballY" : self.pong.ball_pos[1]/900 ,
												"score1" : self.pong.point[0] ,
												"score2" : self.pong.point[1] ,
												"ballsize" : self.pong.ball_size/900 ,
												"paddle1size" : self.pong.player_size[0]/900 ,
												"paddle2size" : self.pong.player_size[1]/900 ,
												"type" : "sendMessage"}))

	async def runGame(self):
		while self.pong.running:
			# ia move
			self.pong.player_pos[0] = ai_brain(self.pong, 1, 20)
			# ball move
			self.pong.ball_walk()
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
			await self.sendMessage()
			await asyncio.sleep(1/240)

class MatchmakingPongConsumer(AsyncWebsocketConsumer):
	async def connect(self):
		await self.accept()

	async def receive(self, text_data):
		if text_data == 'search':
			await self.channel_layer.group_add("matchmaking_group", self.channel_name)
			await self.send(text_data="Searching for opponent...")

			# Vérifie si le groupe de matchmaking contient deux utilisateurs
			if len(await self.channel_layer.group_members("matchmaking_group")) == 2:
				# Récupère les deux utilisateurs du groupe
				users = await self.channel_layer.group_pop("matchmaking_group")
				# Crée une salle de jeu pour eux
				room_name = f"game_room_{self.channel_name}"
				await self.channel_layer.group_add(room_name, users[0])
				await self.channel_layer.group_add(room_name, users[1])
				# Informe chaque utilisateur de la création de la salle de jeu
				await self.channel_layer.group_send(room_name, {
					"type": "matchmaking.success",
					"room_name": room_name
				})

	async def disconnect(self, close_code):
		await self.channel_layer.group_discard("matchmaking_group", self.channel_name)
