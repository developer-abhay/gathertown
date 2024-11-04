import { Router } from 'express'
import { signin, signup } from '../controllers/auth'
import { authenticateUser, checkIfUserExists, validateAuthInputs } from '../middlewares/auth'
import { getAllAvatars, getAllElements, getAllUsersMetadata, updateUserMetadata } from '../controllers/metadata'

import spaceRouter from './space.router'
import adminRouter from './admin.router'

const appRouter = Router()

// Auth
appRouter.post('/signup', validateAuthInputs, checkIfUserExists, signup)
appRouter.post('/signin', validateAuthInputs, checkIfUserExists, signin)

// Authenticated routes below
appRouter.use(authenticateUser)

// Extra
appRouter.post('/user/metadata', updateUserMetadata)
appRouter.get('/user/metadata/bulk', getAllUsersMetadata)
appRouter.get('/avatars', getAllAvatars)
appRouter.get('/elements', getAllElements)

// Space Routes
appRouter.use('/space', spaceRouter)

// Admin
appRouter.use('/admin', adminRouter)


export default appRouter