import * as React from "react"

export function Modal(props: { active: boolean; children: React.ReactNode }) {
  return (
    <div className={`modal ${props.active ? "is-active" : ""}`}>
      <div className={"modal-background"} />
      <div className={"modal-content"}>
        <div className={"box"}>{props.children}</div>
      </div>
      <button className={"modal-close is-large"} />
    </div>
  )
}
