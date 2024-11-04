import { Router } from 'express'
import { signin, signup } from '../controllers/auth'
import { authenticateUser, checkIfUserExists, validateAuthInputs } from '../middlewares/auth'
import { getAllAvatars, getAllElements, getAllUsersMetadata, updateUserMetadata } from '../controllers/metadata'
import { addElementToSpace, createSpace, deleteSpaceById, deleteSpaceElements, getAllSpace, getSpaceById } from '../controllers/space'

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


// Space
appRouter.get('/space/all', getAllSpace)
appRouter.get('/space/:spaceId', getSpaceById)
appRouter.post('/space', createSpace)
appRouter.post('/space/element', addElementToSpace)
appRouter.delete('/space/element', deleteSpaceElements)
appRouter.delete('/space/:spaceId', deleteSpaceById)


// Admin
appRouter.post('/admin/element', (req, res) => {
    console.log('create elements')
})
appRouter.put('/admin/element/:elementId', (req, res) => {
    console.log('update element by id')
})
appRouter.post('/admin/avatar', (req, res) => {
    console.log('create avatar')
})
appRouter.post('/admin/map', (req, res) => {
    console.log('create map')
})

export default appRouter