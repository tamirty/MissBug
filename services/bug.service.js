import { utilService } from "./util.service.js"

export const bugService = {
    query,
    getById,
    remove,
    save,
}

const path = './data/bug.json'
const bugs = utilService.readJsonFile('./data/bug.json')

function query(filterBy = {}, sortBy) {
    let filteredBugs = [...bugs]

    if (filterBy.txt) {
        const regExp = new RegExp(filterBy.txt, 'i')
        filteredBugs = filteredBugs.filter(bug => regExp.test(bug.title))
    }

    if (filterBy.minSeverity) {
        filteredBugs = filteredBugs.filter(bug => bug.severity >= filterBy.minSeverity)
    }

    if (filterBy.labels && filterBy.labels > 0) {
        filteredBugs = filteredBugs.labels.some(label => bug.labels?.includes(label))
    }

    if (sortBy.sortField === 'severity' || sortBy.sortField === 'createdAt') {
        const { sortField } = sortBy

        filteredBugs.sort((bug1, bug2) =>
            (bug1[sortField] - bug2[sortField] * sortBy.sortDir))
    } else if (sortBy.sortField === 'title') {
        filteredBugs.sort((bug1, bug2) =>
            (bug1.title.localeCompare(bug2.title)) * sortBy.sortDir)
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
        bugToSave.createdAt = Date.now()
        bugs.push(bugToSave)
    }
    return _saveBugs()
        .then(() => bugToSave)
}

function _saveBugs() {
    return utilService.writeJsonFile(path, bugs)
}
