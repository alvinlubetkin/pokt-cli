const getPassword = async () => {

    return new Promise((resolve, reject)=> {

    // const l = console.log
        const stdout = process.stdout
        const stdin = process.stdin

        stdout.write("password:")
        stdin.setRawMode(true)
        stdin.resume()
        stdin.setEncoding('utf-8')
        let input = ''

        const pn = (data, key) => {
            const c = data
            switch (c) {
                case '\u0004': // Ctrl-d
                case '\r':
                case '\n':
                    return enter()
                case '\u0003': // Ctrl-c
                    return ctrlc()
                default:
                    // backspace
                    if (c.charCodeAt(0) === 8) return backspace()
                    else return newchar(c)
            }
        }

        stdin.on("data", pn)

        function enter() {
            stdin.removeListener('data', pn)
            stdin.setRawMode(false)
            stdin.pause()
            resolve(input)
        }

        function ctrlc() {
            stdin.removeListener('data', pn)
            stdin.setRawMode(false)
            stdin.pause()
            reject('ctrl-c')
        }

        function newchar(c) {
            input += c
        }

        function backspace() {
            input = input.slice(0, input.length - 1)
        }
    }) 
}
exports.getPassword = getPassword;