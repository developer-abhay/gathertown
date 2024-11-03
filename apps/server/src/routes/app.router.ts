import { Router } from 'express'

const appRouter = Router()

// Auth
appRouter.post('/signup', (req, res) => {
    console.log('Signup')
})
appRouter.post('/signin', (req, res) => {
    console.log('Signin')
})

// Extra
appRouter.post('/user/metadata', (req, res) => {
    console.log('user metadat')
})
appRouter.get('/avatars', (req, res) => {
    console.log('avatarr')
})
appRouter.get('/user/metadata/bulk', (req, res) => {
    console.log('bulk metadata')
})
appRouter.get('/elements', (req, res) => {
    console.log('Signup')
})


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