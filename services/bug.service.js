import { utilService } from "./util.service.js"

export const bugService = {
    query,
    getById,
    remove,
    save,
}

const path = './data/bug.json'
const bugs = utilService.readJsonFile('./data/bug.json')

function query(filterBy = {}) {
    let filteredBugs = [...bugs]

    if (filterBy.txt) {
        const regExp = new RegExp(filterBy.txt, 'i')
        filteredBugs = filteredBugs.filter(bug => regExp.test(bug.title))
    }

    if (filterBy.minSeverity) {
        filteredBugs = filteredBugs.filter(bug => bug.severity >= filterBy.minSeverity)
    }

    return Promise.resolve(filteredBugs)
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

function save(bugToSave) {
    if (bugToSave._id) {
        const bugIdx = bugs.findIndex(bug => bug._id === bugToSave._id)
        bugs[bugIdx] = { ...bugs[bugIdx], ...bugToSave }
    } else {
        bugToSave._id = utilService.makeId()
        bugs.push(bugToSave)
    }
    return _saveBugs()
        .then(() => bugToSave)
}

function _saveBugs() {
    return utilService.writeJsonFile(path, bugs)
}
