import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2026-02-01'})
const singletonId = 'header'

const existingSingleton = await client.getDocument(singletonId)

if (existingSingleton) {
    console.log('Il singleton Header esiste già: nessuna modifica necessaria.')
    process.exit(0)
}

const legacyHeaders = await client.fetch(
    '*[_type == "header" && !(_id in path("drafts.**"))]{...}',
)

if (legacyHeaders.length !== 1) {
    throw new Error(
        `Atteso un solo Header pubblicato da migrare, trovati: ${legacyHeaders.length}.`,
    )
}

const [legacyHeader] = legacyHeaders
const legacyId = legacyHeader._id
const content = {...legacyHeader}

delete content._id
delete content._rev
delete content._createdAt
delete content._updatedAt

await client
    .transaction()
    .create({_id: singletonId, ...content})
    .delete(legacyId)
    .commit()

console.log(`Header migrato da ${legacyId} a ${singletonId}.`)
