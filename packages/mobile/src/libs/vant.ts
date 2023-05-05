import { App } from 'vue';
import {
  Button,
  CellGroup,
  Cell,
  ConfigProvider,
  Icon,
  Image,
  Row,
  Col,
  Popup,
  Space,
  Toast,
  Calendar,
  Cascader,
  CheckboxGroup,
  Checkbox,
  DatePicker,
  Field,
  Form,
  NumberKeyboard,
} from 'vant';

export default {
  install(app: App, options: any) {
    [
      Button,
      CellGroup,
      Cell,
      ConfigProvider,
      Icon,
      Image,
      Row,
      Col,
      Popup,
      Space,
      Toast,
      Calendar,
      Cascader,
      CheckboxGroup,
      Checkbox,
      DatePicker,
      Field,
      Form,
      NumberKeyboard,
    ].forEach((component) => app.use(component));
  },
};
