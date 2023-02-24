import s from 'sin'

s.css`
  *, ::before, ::after {
    box-sizing border-box
  }

  body {
    ff monospace
    m 0
    p 20
  }
  h1 {
    p 0
    m 0
  }
`

s.mount(({}, [], { route }) => {
  let token = route.query.get('t')
  return () =>
    s``(
      s`
        d flex
        ai baseline
      `(
        s`h1
          mb 20
        `('jwt.show'),
        s`
          ml 10px
        `(
          'Your friendly neighborhood jwt decoder! All decoding is done client side so your info never touches a server.'
        )
      ),
      s`input
        w 100%
        br 2
        border 1px solid gray
        ff monospace
        p 4
        mb 20
      `({
        type: 'text',
        placeholder: 'paste jwt here',
        autofocus: true,
        value: token,
        onchange: e => {
          token = e.target.value
        }
      }),
      token && s(() => {
        const decoded = JSON.parse(atob(token.split('.')[1]))
        // const object = obj => Object.entries(obj).map(([key, value]) =>
        //   s``(
        //     s``('{'),
        //     s``('}')
        //   )
        // )
        const object = (key, val) => s``(
          s`
            d flex
          `(
            s`; mr 6; c dodgerblue`('"' + key + '":'),
            '{',
          ),
          sub(val),
          s``('}')
        )
        const simple = (key, val) => s``(
          s`
            d flex
          `(
            s`; mr 6; c dodgerblue`('"' + key + '":'),
            s`
              c ${
                val === null || typeof val == 'boolean'
                  ? 'purple'
                  : typeof val === 'number'
                    ? 'hotpink'
                    : typeof val === 'string'
                      ? 'goldenrod'
                      : 'black'
              }
            `(
              typeof val === "string" && '"',
              String(val),
              typeof val === "string" && '"'
            )
          )
        )
        const array = (key, arr) => s``(
          s`
            d flex
          `(
            s`; mr 6; c dodgerblue`('"' + key + '":'),
            s``("["),
          ),
          s``(
            arr.map(sub)
          ),
          s``("],")
        )
        const sub = obj => Object.entries(obj).map(([key, val]) =>
          s`
            d flex
            pl 10
          `(
            Array.isArray(obj) && typeof obj !== 'string'
              ? obj.map(sub)
              : typeof val === 'object' && val !== null && !Array.isArray(val)
                ? object(key, val)
                : Array.isArray(val)
                  ? array(key, val)
                  : simple(key, val)
          )
        )
        return () =>
          s`
            fs 16
          `(
            '{',
            s``(
              sub(decoded)
            ),
            '}'
          )
      })
    )
})
