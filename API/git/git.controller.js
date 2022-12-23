const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('../../_middleware/validate-request');
const gitService = require('./git.service');

// routes
router.post('/gitEvent', postGitEventSchema, postGitEvent);

module.exports = router;

// Post GitEvent
function postGitEventSchema(req, res, next) {
    const schema = Joi.object({
        ref: Joi.string().required(),
        repository: Joi.object({
            id: Joi.number().required(),
            name: Joi.string().required(),
        }).required(),
        head_commit: Joi.object({
            timestamp: Joi.string().required(),
            url: Joi.string().required(),
            author: Joi.object({
                name: Joi.string().required(),
                email: Joi.string().required(),
                username: Joi.string().required()
            }).required(),
            committer: Joi.object({
                name: Joi.string().required(),
                email: Joi.string().required(),
                username: Joi.string().required()
            }).required(),
            added: Joi.array().items(Joi.string()).required(),
            removed: Joi.array().items(Joi.string()).required(),
            modified: Joi.array().items(Joi.string()).required()
        }).required()
    });
    validateRequest(req, next, schema);
}
function postGitEvent(req, res, next) {
    gitService.gitEvent(req.body)
        .then(resp => res.json(resp))
        .catch(next);
}