import {
  getRecommendDynamics,
  sendDynamic,
  getLatestDynamics,
  getSongsByNameOrProducer,
  getDynamicById,
} from './dynamic';
import {
  login,
  getAdminInfo,
  getUserInfo,
  register,
  checkUserNameUnique,
  checkNickNameUnique,
  loginAdmin,
} from './sign';
import {
  getSongsByStyleId,
  getAllStyles,
  getRecommendSongs,
  getRecommendPlayLists,
  getPlayListsByStyleId,
} from './style';
import { searchSongs, searchAlbums, searchUsers, searchArtists, searchPlayLists } from './search';
import { sendComment, getCommentsById, getSubCommentsById } from './comments';
import { getRecommendAlbums, getAlbumById } from './album';
import { getSongById } from './song';
import { getPlayListsById } from './playlist';
import { getDynamicByUserId, getPlayListsByUserId } from './user';
const api = {
  loginAdmin,
  login,
  getAdminInfo,
  getUserInfo,
  register,
  checkUserNameUnique,
  checkNickNameUnique,
  getSongsByStyleId,
  getAllStyles,
  getRecommendSongs,
  getRecommendDynamics,
  sendDynamic,
  getLatestDynamics,
  getSongsByNameOrProducer,
  searchSongs,
  searchAlbums,
  getRecommendAlbums,
  searchUsers,
  searchArtists,
  getDynamicById,
  sendComment,
  getCommentsById,
  getSubCommentsById,
  getAlbumById,
  getSongById,
  getRecommendPlayLists,
  getPlayListsById,
  getPlayListsByStyleId,
  searchPlayLists,
  getDynamicByUserId,
  getPlayListsByUserId,
};
export default api;
