import { AbstractActions } from "./AbstractActions"

export class TemplateUiActions extends AbstractActions {
  private static creator = TemplateUiActions.getActionCreator()

  static toggleNavbarMenuForMobile = TemplateUiActions.creator("toggleNavbarMenuForMobile")
  toggleNavbarMenuForMobile = () => {
    this.dispatch(TemplateUiActions.toggleNavbarMenuForMobile())
  }
}
