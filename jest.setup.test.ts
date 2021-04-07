import fs from 'fs'

test('manifest.json exists', () => {
	expect(fs.existsSync('dist/manifest.json')).toBe(true)
})
