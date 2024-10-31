# ExtraAlltFrontend


## För att starta backend:
1. Se till att ha mongodb installerat
2. Se till så du har java version 17 eller senare
3. Ladda ner projektet
4. Öppna i VSC
5. Lägg till # innan "spring.data.mongodb.uri=${DB_URI}" i application.properties och ta bort # på "#spring.data.mongodb.host=localhost" och
"#spring.data.mongodb.port=27017" för att köra lokalt
6. lägg till egna nycklar för jwtSecret:${JWT_SECRET}
stripeKey:${STRIPE_KEY} openai.api.url=${OPENAI_URL}
openai.api.key=${OPENAI_API_KEY}
8. Du kan övervaka databasen med Studio3T eller MongodbCompass
9. Starta projektet
10. Ifall du vill få tillgång till data finns databas medskickat i rooten i mappen Local_DB
11. I stripeController.java behövs ändras i .setsucessUrl och .setCancelUrl till `http://localhost:5173/?page=SuccessPage` och `http://localhost:5173/?page=CancelPage`

## För att starta frontend:
1. Se till att ha node.js installerat
2. Ladda ner projektet
3. Se till att backend delen är igång
4. Öppna i VSC
5. Kör kommando i terminalen "npm install" för att installera dependencies
6. Kör kommando i terminalen "npm run dev" för att starta applikationen
7. Öppna applikationen, du får fram en port (brukar vara "http://localhost:5173/")
8. På rad 184 i TopicChatRoom.tsx finns en windows.location.href som behöver ändras från deployade till `http://localhost:5173/?page=TopicPage`


## I Backend kan du:
1. Registrera användare
2. Logga in användare
3. Skapa topics
4. Ta bort topic
5. Få användare i topic
6. Meddelande i topic
7. Join topic
8. Leave topic
9. Skicka fråga till ai som sänder svar och lagras i ingående topicId

## I Frontend kan du:
1. Registrera användare
2. Logga in användare
3. Skapa topics
4. Ta bort topic
5. Få användare i topic
6. Skicka meddelande i topic
7. Join topic
8. Leave topic
9. Skicka fråga till ai
10. Handla varor med Stripe
11. Ladda ner lite Ai art för eget bruk


## Om projktetet:
Jag har gjort ett forum som använder websocket som kommunkation och Ai funktion som aktiveras vid frasen "Hey bot". I applikationen kan man även handla produkter och betala via Stripe checkout.


## Länkar:
Backend: https://github.com/Brainztew/ExtraAlltBackend <br>
Frontend: https://github.com/Brainztew/ExtraAlltFrontend <br>
Deployad: https://coral-app-ei5fb.ondigitalocean.app/?page=start
