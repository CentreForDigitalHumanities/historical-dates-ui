# historical-dates-ui

[![DOI](https://zenodo.org/badge/144034950.svg)](https://zenodo.org/badge/latestdoi/144034950)
[![NPM](https://img.shields.io/npm/v/historical-dates-ui.svg)](https://www.npmjs.com/package/historical-dates-ui)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

React UI components for entering [historical-dates](https://github.com/UUDigitalHumanitieslab/historical-dates).

## Live example

[Try the component!](https://CentreForDigitalHumanities.github.io/historical-dates-ui)

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

## Licence

Historical dates UI is shared under a BSD 3-Clause licence. See [LICENSE](./LICENSE) for more information.

## Citation

If you wish to cite this repository, please use the metadata provided in the [CITATION.cff file](./CITATION.cff).

## Contact

For questions, small feature suggestions, and bug reports, feel free to [create an issue](https://github.com/CentreForDigitalHumanities/historical-dates-ui/issues/new). If you do not have a Github account, you can also [contact the Centre for Digital Humanities](https://cdh.uu.nl/contact/).
