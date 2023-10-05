import * as React from "react"

export function Modal(props: { close: () => void; children: React.ReactNode }) {
  return (
    <div className={"modal is-active"}>
      <div className={"modal-background"} onClick={props.close} />
      <div className={"modal-content"}>
        <div className={"box"}>{props.children}</div>
      </div>
      <button className={"modal-close is-large"} onClick={props.close} />
    </div>
  )
}
