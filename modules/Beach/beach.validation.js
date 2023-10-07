import Joi from 'joi'
import { generalFields } from '../../utils/validation.js'


export const addBeachValidation = Joi.object({
    beachName: Joi.string().required().max(30).min(4).required(),
    capabilityToSwim: Joi.boolean().required(),
    capabilityToDrink: Joi.boolean().required(),
    species: Joi.array().items(Joi.string().required()).required(),
    city: Joi.string().required(),
    tips: Joi.string().required(),
    file: Joi.array().items(generalFields.file).required(),
})