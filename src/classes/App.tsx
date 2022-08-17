import React from 'react'
import { ReactWidget } from '@jupyterlab/apputils'
import { Provider } from 'react-redux'
import { JobsApp } from '../components/JobsApp/JobsApp'
import { EXTENSION_CSS_CLASSNAME } from '../enums'
import store from '../redux/store'

export class ReactAppWidget extends ReactWidget {
  constructor() {
    super()
    this.addClass(EXTENSION_CSS_CLASSNAME)
  }

  render(): JSX.Element {
    return (
      <Provider store={store}>
        <JobsApp />
      </Provider>
    )
  }
}