import {
  getRecommendDynamics,
  sendDynamic,
  getLatestDynamics,
  getSongsByNameOrProducer,
  getDynamicById,
  deleteDynamic,
  getApprovingDynamics, changeDynamicsAuditStatus,
} from './dynamic';
import {
  login,
  getAdminInfo,
  getUserInfo,
  register,
  checkUserNameUnique,
  checkNickNameUnique,
  loginAdmin,
  changePassword,
} from './sign';
import {
  getSongsByStyleId,
  getAllStyles,
  getRecommendSongs,
  getRecommendPlayLists,
  getPlayListsByStyleId,
} from './style';
import { searchSongs, searchAlbums, searchUsers, searchArtists, searchPlayLists } from './search';
import {
  sendComment,
  getCommentsById,
  getSubCommentsById,
  deleteComment,
  getApprovingComments,
  changeCommentsAuditStatus
} from './comments';
import { getRecommendAlbums, getAlbumById, getAlbumByUserId, getApprovingAlbums } from './album';
import { getSongById } from './song';
import {
  getPlayListsById,
  createPlayList,
  updatePlayList,
  deletePlayList,
  addSongToPlayList,
  deletePlayListSong, changePlayListsAuditStatus, getApprovingPlayLists,
} from './playlist';
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
  changePassword,
  createPlayList,
  updatePlayList,
  deletePlayList,
  deleteDynamic,
  addSongToPlayList,
  deletePlayListSong,
  getAlbumByUserId,
  deleteComment,
  admin: {
    getApprovingAlbums,
    getApprovingDynamics,
    changeDynamicsAuditStatus,
    getApprovingComments,
    changeCommentsAuditStatus,
    changePlayListsAuditStatus,
    getApprovingPlayLists
  },
};
export default api;
