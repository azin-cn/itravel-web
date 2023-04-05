import router from './index';

/**
 * 重定向到article
 * @param articleId
 */
export const redirectArticle = async (articleId: string) => {
  router.push({
    name: 'article',
    params: { articleId },
  });
};

/**
 * 重定向userinfo
 * @param userId
 */
export const redirectUserInfo = (userId: string) => {
  router.push({
    name: 'userinfo',
    params: { userId },
  });
};

export default { redirectArticle, redirectUserInfo };
