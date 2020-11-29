import * as firebase from '@firebase/testing'

const projectId = 'test-project'
const coverageUrl = `http://localhost:8080/emulator/v1/projects/${projectId}:ruleCoverage.html`

function authedApp() {
  return firebase.initializeTestApp({ projectId }).firestore()
}

beforeEach(async () => {
  // Clear the database between tests
  await firebase.clearFirestoreData({ projectId })
})

afterAll(async () => {
  await Promise.all(firebase.apps().map(app => app.delete()))
  console.log(`View rule coverage information at ${coverageUrl}\n`)
})

describe('UserStore', () => {
  describe('create', () => {
    test('Should add the given object to the database', () => {
      expect(Math.log(1)).toBe(3)
    })
  })
})
