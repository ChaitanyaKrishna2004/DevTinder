# DevTinder APIs

authRouter

- POST /signup -> Create user
- POST /login -> login user
- POST /logout -> logout user

profileRouter

- GET /profile/view -> Get user
- PATCH /profile/edit -> update user
- PATCH /profile/password -> forget password

connectionRequestRouter

- POST /request/send/:status/:userId status->interested,ignored
- POST /request/review/:status/:requestId status->accepted,rejected

userRouter

- GET /user/connections
- GET /user/requests/received
- GET /user/feed - Gets you the profiles of other users on platform

Status: ignored, interested, accepted, rejected
