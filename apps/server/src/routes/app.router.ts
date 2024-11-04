import { Router } from 'express'
import { signin, signup } from '../controllers/auth'
import { authenticateUser, checkIfUserExists, validateAuthInputs } from '../middlewares/auth'
import { getAllAvatars, getAllElements, getAllUsersMetadata, updateUserMetadata } from '../controllers/metadata'

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
appRouter.post('/space', (req, res) => {
    console.log('create space')
})
appRouter.delete('/space/:spaceId', (req, res) => {
    console.log('delete space')
})
appRouter.get('/space/all', (req, res) => {
    console.log('get all space')
})
appRouter.get('/space/:spaceId', (req, res) => {
    console.log('get space by id')
})
appRouter.post('/space/element', (req, res) => {
    console.log('add elements to space')
})
appRouter.delete('/space/element', (req, res) => {
    console.log('delete elements from space')
})


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