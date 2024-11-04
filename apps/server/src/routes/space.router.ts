import { Router } from 'express'
import { addElementToSpace, createSpace, deleteSpaceById, deleteSpaceElements, getAllSpace, getSpaceById } from '../controllers/space'

const spaceRouter = Router()

spaceRouter.post('/', createSpace)
spaceRouter.get('/all', getAllSpace)
spaceRouter.get('/:spaceId', getSpaceById)
spaceRouter.delete('/:spaceId', deleteSpaceById)
spaceRouter.post('/element', addElementToSpace)
spaceRouter.delete('/element', deleteSpaceElements)

export default spaceRouter