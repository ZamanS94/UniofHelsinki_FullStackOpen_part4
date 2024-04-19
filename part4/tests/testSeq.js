import { execSync } from 'child_process'

const testFiles = ['./tests/blog_api.test.js', './tests/user_api.test.js']


testFiles.forEach(testFile => {
    try {
        console.log(`Running ${testFile}...`)
        execSync(`node ${testFile}`, { stdio: 'inherit' })
    } catch (error) {
        console.error(`Error running ${testFile}: ${error}`)
        process.exit(1) 
    }
})

console.log('All tests completed successfully.')
