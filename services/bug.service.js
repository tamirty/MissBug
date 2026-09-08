import { utilService } from "./util.service.js"

export const bugService = {
    query,
    getById,
    remove,
}

const path = './data/bug.json'
const bugs = utilService.readJsonFile('./data/bug.json')

function query() {
    return Promise.resolve(bugs)
}

function getById(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)
    return Promise.resolve(bug)
}

function remove(bugId) {
    const bugIdx = bugs.findIndex(bug => bug._id === bugId)
    bugs.splice(bugIdx, 1)

    return _saveBugs()
}

function _saveBugs() {
   return utilService.writeJsonFile(path, bugs)
}