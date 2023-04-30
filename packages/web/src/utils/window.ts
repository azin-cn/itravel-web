import * as settings from '@/config/settings.json';

/**
 * 设置文档标题
 * @param title
 * @param prefix
 */
export function setDocumentTitle(title: string, prefix = true) {
  if (prefix) {
    document.title = `${settings.title} - ${title}`;
  } else {
    document.title = title || 'itravel';
  }
}

export default {
  setDocumentTitle,
};
