import './themes/default/index.scss';

import { prefix } from './utils';

export { version } from './utils';

export { default as Element } from './flare-element';

import Button from './widgets/button';
export { default as Button } from './widgets/button';
customElements.define(`${prefix}button`, Button);

import Checkbox from './widgets/checkbox';
export { default as Checkbox } from './widgets/checkbox';
customElements.define(`${prefix}checkbox`, Checkbox);

import Dropdown from './widgets/dropdown';
export { default as Dropdown } from './widgets/dropdown';
customElements.define(`${prefix}dropdown`, Dropdown);

import GroupBoxLabel from './widgets/group-box-label';
export { default as GroupBoxLabel } from './widgets/group-box-label';
customElements.define(`${prefix}group-box-label`, GroupBoxLabel);

import GroupBox from './widgets/group-box';
export { default as GroupBox } from './widgets/group-box';
customElements.define(`${prefix}group-box`, GroupBox);

import HelpText from './widgets/help-text';
export { default as HelpText } from './widgets/help-text';
customElements.define(`${prefix}help-text`, HelpText);

import Label from './widgets/label';
export { default as Label } from './widgets/label';
customElements.define(`${prefix}label`, Label);

import Layout from './widgets/layout';
export { default as Layout } from './widgets/layout';
customElements.define(`${prefix}layout`, Layout);

import NavigationItem from './widgets/navigation-item';
export { default as NavigationItem } from './widgets/navigation-item';
customElements.define(`${prefix}navigation-item`, NavigationItem);

import Navigation from './widgets/navigation';
export { default as Navigation } from './widgets/navigation';
customElements.define(`${prefix}navigation`, Navigation);

import NumberInput from './widgets/number-input';
export { default as NumberInput } from './widgets/number-input';
customElements.define(`${prefix}number-input`, NumberInput);

import Option from './widgets/option';
export { default as Option } from './widgets/option';
customElements.define(`${prefix}option`, Option);

import Radio from './widgets/radio';
export { default as Radio } from './widgets/radio';
customElements.define(`${prefix}radio`, Radio);

import Stepper from './widgets/stepper';
export { default as Stepper } from './widgets/stepper';
customElements.define(`${prefix}stepper`, Stepper);

import Switch from './widgets/switch';
export { default as Switch } from './widgets/switch';
customElements.define(`${prefix}switch`, Switch);

import Tabbar from './widgets/tabbar';
export { default as Tabbar } from './widgets/tabbar';
customElements.define(`${prefix}tabbar`, Tabbar);

import TableBody from './widgets/table-body';
export { default as TableBody } from './widgets/table-body';
customElements.define(`${prefix}table-body`, TableBody);

import TableColumn from './widgets/table-column';
export { default as TableColumn } from './widgets/table-column';
customElements.define(`${prefix}table-column`, TableColumn);

import TableHeader from './widgets/table-header';
export { default as TableHeader } from './widgets/table-header';
customElements.define(`${prefix}table-header`, TableHeader);

import TableRow from './widgets/table-row';
export { default as TableRow } from './widgets/table-row';
customElements.define(`${prefix}table-row`, TableRow);

import Table from './widgets/table';
export { default as Table } from './widgets/table';
customElements.define(`${prefix}table`, Table);

import Tab from './widgets/tab';
export { default as Tab } from './widgets/tab';
customElements.define(`${prefix}tab`, Tab);

import Tabview from './widgets/tabview';
export { default as Tabview } from './widgets/tabview';
customElements.define(`${prefix}tabview`, Tabview);

import TextInput from './widgets/text-input';
export { default as TextInput } from './widgets/text-input';
customElements.define(`${prefix}text-input`, TextInput);

import WindowContent from './widgets/window-content';
export { default as WindowContent } from './widgets/window-content';
customElements.define(`${prefix}window-content`, WindowContent);

import WindowTitlebar from './widgets/window-titlebar';
export { default as WindowTitlebar } from './widgets/window-titlebar';
customElements.define(`${prefix}window-titlebar`, WindowTitlebar);

import Window from './widgets/window';
export { default as Window } from './widgets/window';
customElements.define(`${prefix}window`, Window);
