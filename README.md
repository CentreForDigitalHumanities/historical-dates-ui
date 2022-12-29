# historical-dates-ui

[![DOI](https://zenodo.org/badge/144034950.svg)](https://zenodo.org/badge/latestdoi/144034950)
[![NPM](https://img.shields.io/npm/v/historical-dates-ui.svg)](https://www.npmjs.com/package/historical-dates-ui) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

React UI components for entering [historical-dates](https://github.com/UUDigitalHumanitieslab/historical-dates).

## Live example

[Try the component!](https://UUDigitalHumanitieslab.github.io/historical-dates-ui)

## Install

```bash
npm install --save historical-dates-ui
```

## Usage

```tsx
import * as React from 'react'

import { DateAnnotatorComponent } from 'historical-dates-ui'

class Example extends React.Component {
  render () {
    return (
      <DateAnnotatorComponent text="ad III kal mar MCMLXXXVII" onChange={function() {}} />
    )
  }
}
```

## License

ISC © [UUDigitalHumanitieslab](https://github.com/UUDigitalHumanitieslab)
