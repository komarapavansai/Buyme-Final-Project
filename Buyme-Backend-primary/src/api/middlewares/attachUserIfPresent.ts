import { Container } from 'typedi';
import { Logger } from 'winston';
import { decode } from 'jwt-simple'
import config from '../../config'
/**
 * Attach user to req.currentUser
 * @param {*} req Express req Object
 * @param {*} res  Express res Object
 * @param {*} next  Express next Function
 */
const attachUserIfPresent = async (req, res, next) => {
  const logger: Logger = Container.get('logger');
  try {
    const authHeader = req.headers['authorization']
    req.isTokenPresent = false;
    req.claims = {};
    req.claims.isBearerToken = false;
    if(!authHeader) return next();

    try {
      if (authHeader.includes('Bearer')) {
        let token = authHeader.split(' ')[1]
        var decoded = decode(
          token,
          config.jwtSecret
        );
        req.isTokenPresent = true;
        req.claims = decoded;
        req.claims.isBearerToken = true;
        // req.claims.isStudent = decoded.roles.includes("ROLE_STUDENT");
        req.claims.token = token;
        logger.info("orgId:" + req.claims.orgId + "and masterOrgId:" + req.claims.masterOrgId);
        logger.info("userinfo - name:" + req.claims.name + ",role:" + decoded.roles)
        return next();
      } else if (authHeader.includes('Token')) {
        let token = authHeader.split(' ')[1]
        if (token === process.env.PROGRESS_TOKEN) {
          req.claims = req.body;
          req.claims.token = token;
          req.isTokenPresent = true;
          if (req.claims === undefined) {
            req.claims = []
            req.claims.masterOrgId = null;
          }
          next();
        }
      }
    } catch (err) {
      console.log(`ERROR FORM AUTH MIDDLEWARE::${err}`);
      // res.status(400).send('Invalid token')
      logger.error('🔥 Error attaching user to req: %o', err);
      return next(err);
    }

  } catch (e) {
    logger.error('🔥 Error attaching user to req: %o', e);
    return next(e);
  }
};

const getTokenFromHeader = req => {
  /**
   * @TODO Edge and Internet Explorer do some weird things with the headers
   * So I believe that this should handle more 'edge' cases ;)
   */
  if (
    (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token') ||
    (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer')
  ) {
    return req.headers.authorization.split(' ')[1];
  }
  return null;
};

export default attachUserIfPresent;
