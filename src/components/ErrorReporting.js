import React from 'react'
import { Alert, Button, SpaceBetween } from '@cloudscape-design/components'

export const ErrorAlert = ({ error, onDismiss }) => {
  const {message, error_details, stackTrace} = error
  return (
    <Alert
      dismissAriaLabel="Close alert"
      dismissible
      statusIconAriaLabel="Error"
      type="error"
      onDismiss={onDismiss}
    >
      <SpaceBetween size="xxs">
        <div>
          <div>Message: {message}</div>
          <div>Details: {error_details}</div>
          <div>Stack: {stackTrace ? stackTrace.split("\n\t").map(line => <p style={{margin: "1px", fontSize: "12px"}}>{line}</p>) : '-'}</div>
        </div>
        <Button
          href={`https://github.com/MatteoGioioso/postgres-explain/issues/new?title=[Explain web]: add your title&body=${JSON.stringify(error, null, 2)}`}
          target="_blank"
          rel="noopener noreferrer"
          variant="link">
          Report issue
        </Button>

      </SpaceBetween>
    </Alert>
  )
}