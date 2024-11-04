import { Router } from 'express'
import { createAvatar, createElement, createMap, updateElementById } from '../controllers/admin'

const adminRouter = Router()

adminRouter.post('/element', createElement)
adminRouter.put('/element/:elementId', updateElementById)
adminRouter.post('/avatar', createMap)
adminRouter.post('/map', createAvatar)

export default adminRouter