import { AbstractActions } from "./AbstractActions"

export class TemplateUIActions extends AbstractActions {
  private static creator = TemplateUIActions.getActionCreator()

  static toggleNavbarMenuForMobile = TemplateUIActions.creator("toggleNavbarMenuForMobile")
  toggleNavbarMenuForMobile = () => {
    this.dispatch(TemplateUIActions.toggleNavbarMenuForMobile())
  }
}
