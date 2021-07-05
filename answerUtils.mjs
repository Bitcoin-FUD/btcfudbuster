import toml from 'toml'
import fs from 'fs'
import glob from 'glob'
import path from 'path'
const __dirname = path.resolve()

const allMaterial = glob.sync(path.join(__dirname, '/material/**/*.toml'))
  .map(path => fs.readFileSync(path, { encoding: 'utf-8'}))
  .map(file => toml.parse(file))
  .map(material => {
    material.tags = material.tags.replace(/\s/g, '').split(',')
    return material
  })

/**
 * @description Method to get random element from array
 * @param {*[]} arr the array
 * @returns {*} random element
 * @example random(['a', 'b', 'c'])
 */
export const random = arr => {
  return arr[Math.floor(Math.random() * arr.length)]
}
export const getMostRelevantAnswer = query => {
  if (!query) return null
  let answers = allMaterial
    .map(material => {
      material.hits = query
        .split(' ')
        .filter(keyword => keyword.indexOf('#') === 0)
        .map(keyword => keyword.toLowerCase().replace(/[^a-z0-9]/g, ''))
        .filter(keyword => material.tags.indexOf(keyword.toLowerCase()) !== -1)
        .length

      return material
    })
    .filter(material => material.hits > 0)
    .sort((a, b) => a.hits > b.hits ?
      1 :
      a.hits < b.hits ?
      -1 :
      Math.random() < .5 ? 1 : -1
    )

  let mostRelevantAnswer = answers.pop()
  if (!mostRelevantAnswer) return null

  let url = random(mostRelevantAnswer.links)
  return `${mostRelevantAnswer.answer} ${url}`
}