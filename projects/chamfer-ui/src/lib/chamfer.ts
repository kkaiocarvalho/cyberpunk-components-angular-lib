import { CfFrame } from './core/frame';
import { CfIcon } from './icon/icon';
import { CfButton, CfButtonGroup } from './button/button';
import { CfBadge, CfHint, CfHints, CfKbd } from './badge/badge';
import { CfCard, CfCardFooter, CfCardHeader, CfCardTitle, CfSectionHeader } from './card/card';
import {
  CfCheckbox, CfField, CfInput, CfInputGroup, CfNativeSelect, CfRadio, CfRadioGroup, CfSelect, CfSlider, CfStepper, CfSwitch,
} from './form/form';
import { CfTab, CfTabList, CfTabPanel, CfTabs } from './tabs/tabs';
import { CfItem, CfItemGrid, CfKv, CfNum, CfProgress, CfSegments, CfStat, CfTable, CfTableContainer } from './data/data';
import { CfAlert, CfDialog, CfToaster } from './feedback/feedback';
import { CfDropdown, CfDropdownTrigger, CfMenu, CfMenuItem, CfMenuLabel, CfMenuSeparator, CfTooltip } from './overlay/overlay';
import { CfAccordion, CfAccordionItem, CfTile } from './navigation/navigation';
import { CfAvatar, CfDivider, CfGlitch, CfSkeleton, CfSpinner, CfSysblock } from './decor/decor';

/**
 * Tudo de uma vez, para importar num componente standalone:
 *   @Component({ imports: [CHAMFER_UI] })
 * Ou importe só o que usar, para tree-shaking fino.
 */
export const CHAMFER_UI = [
  CfFrame, CfIcon,
  CfButton, CfButtonGroup,
  CfBadge, CfKbd, CfHints, CfHint,
  CfCard, CfCardHeader, CfCardTitle, CfCardFooter, CfSectionHeader,
  CfField, CfInputGroup, CfInput, CfNativeSelect, CfSelect, CfCheckbox, CfRadioGroup, CfRadio, CfSwitch, CfSlider, CfStepper,
  CfTabs, CfTabList, CfTab, CfTabPanel,
  CfProgress, CfSegments, CfStat, CfItem, CfItemGrid, CfTableContainer, CfTable, CfNum, CfKv,
  CfAlert, CfToaster, CfDialog,
  CfTooltip, CfMenu, CfMenuItem, CfMenuSeparator, CfMenuLabel, CfDropdown, CfDropdownTrigger,
  CfTile, CfAccordion, CfAccordionItem,
  CfAvatar, CfGlitch, CfDivider, CfSkeleton, CfSpinner, CfSysblock,
] as const;
