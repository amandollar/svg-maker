import {arrowSwipeTemplate} from "./arrow-swipe";
import {alertBellTemplate} from "./alert-bell";
import {checkmarkDrawTemplate} from "./checkmark-draw";
import {heartPulseTemplate} from "./heart-pulse";
import {locationPinTemplate} from "./location-pin";
import {starBurstTemplate} from "./star-burst";
import type {AnimationTemplate} from "./template-types";

export const animationTemplates: AnimationTemplate[] = [
  heartPulseTemplate,
  checkmarkDrawTemplate,
  alertBellTemplate,
  arrowSwipeTemplate,
  starBurstTemplate,
  locationPinTemplate,
];

export const animationTemplateMap = new Map(
  animationTemplates.map((template) => [template.id, template]),
);
