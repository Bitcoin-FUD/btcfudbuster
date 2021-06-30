import assert from 'assert'
import { getMostRelevantAnswer } from '../answerUtils.mjs'

describe('answerUtils', () => {
  it('should an answers', () => {
    assert.ok(getMostRelevantAnswer('bitcoin is for criminals'))
  })
  it('should not return an answers', () => {
    assert.ok(getMostRelevantAnswer() === null)
    assert.ok(getMostRelevantAnswer('') === null)
    assert.ok(getMostRelevantAnswer('alkjsdflajohr') === null) // garbage string
  })
})