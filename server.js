import express from 'express'
import cookieParser from 'cookie-parser'

import { bugService } from './services/bug.service.js'

const app = express()
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())

app.get('/api/bug', (req, res) => {
    const filterBy = {
        txt: req.query.txt || '',
        minSeverity: +req.query.minSeverity || 0,
    }

    const sortBy = {
        sortField: req.query.sortField || '',
        sortDir: +req.query.sortDir || 1,
    }

    bugService.query(filterBy,sortBy)
        .then(bugs => res.send(bugs))
})

app.put('/api/bug/:bugId', (req, res) => {
    const bugToSave = {
        _id: req.body._id,
        title: req.body.title,
        description: req.body.description,
        severity: req.body.severity,
    }

    bugService.save(bugToSave)
        .then(savedBug => res.send(savedBug))
})

app.post('/api/bug', (req, res) => {
    const bugToSave = {
        title: req.body.title,
        description: req.body.description,
        severity: req.body.severity,
    }

    bugService.save(bugToSave)
        .then(savedBug => res.send(savedBug))
})

app.get('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params
    const visitedBugs = req.cookies.visitedBugs || []

    if (!visitedBugs.includes(bugId)) {
        if (visitedBugs.length === 3) {
            return res.status(401).send('Wait for a bit')
        } else {
            visitedBugs.push(bugId)
        }
    }
    res.cookie('visitedBugs', visitedBugs, { maxAge: 7 * 1000 })

    bugService.getById(bugId)
        .then(bug => res.send(bug))
        .catch(err => res.status(400).send('cannot get bug'))
})

app.delete('/api/bug/:bugId', (req, res) => {
    const { bugId } = req.params

    bugService.remove(bugId)
        .then(() => res.send(`${bugId} Deleted`))
})

app.listen(3030, () => console.log('Server ready at port 3030'))