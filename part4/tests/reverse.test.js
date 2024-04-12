import { test } from 'node:test'
import assert from 'node:assert'
import { reverse} from '../utils/for_testing.js'
import {dummy} from '../utils/list_helper.js'

test('reverse of a', () => {
  const result = reverse('a')
  debugger
  assert.strictEqual(result, 'a')
})

test('reverse of react', () => {
  const result = reverse('react')

  assert.strictEqual(result, 'tcaer')
})

test('reverse of saippuakauppias', () => {
  const result = reverse('saippuakauppias')

  assert.strictEqual(result, 'saippuakauppias')
})

test('dummy returns one', () => {
    const blogs = []
    const result = dummy(blogs)
    assert.strictEqual(result, 1)
  })