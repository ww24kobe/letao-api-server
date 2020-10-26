/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 50721
Source Host           : localhost:3306
Source Database       : letao

Target Server Type    : MYSQL
Target Server Version : 50721
File Encoding         : 65001

Date: 2020-10-26 10:54:05
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for le_article
-- ----------------------------
DROP TABLE IF EXISTS `le_article`;
CREATE TABLE `le_article` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(50) DEFAULT '',
  `admin_id` int(11) DEFAULT '0',
  `img_url` varchar(255) DEFAULT '',
  `content` text,
  `cat_id` int(11) DEFAULT '0',
  `add_date` datetime DEFAULT NULL,
  `status` tinyint(4) DEFAULT '0' COMMENT '0-未发布（默认） ，1-已发布',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of le_article
-- ----------------------------
INSERT INTO `le_article` VALUES ('5', 'fdsgvcdsf', '1', 'http://placehold.it/50x50/121212/123aaa?text=teacher1', '555555555', '2', '2020-10-13 09:59:06', '1');
INSERT INTO `le_article` VALUES ('7', 'jmhvz', '6', 'http://placehold.it/50x50/fffccc/123aaa?text=teacher3', '777777', '3', '2020-10-13 09:59:06', '1');
INSERT INTO `le_article` VALUES ('8', 'uh dfg4tr', '8', 'http://placehold.it/50x50/cc1122/123aaa?text=teacher4', '8888888', '3', '2020-10-13 09:59:06', '1');
INSERT INTO `le_article` VALUES ('9', 'gsdfgds', '1', 'http://placehold.it/50x50/fffccc/123aaa?text=teacher5', '88888888', '1', '2020-10-13 09:59:06', '1');
INSERT INTO `le_article` VALUES ('10', 'gfvcsfwet', '1', 'http://placehold.it/50x50/fffccc/123aaa?text=teacher6', '111111111111111111111', '1', '2020-10-13 09:59:06', '1');
INSERT INTO `le_article` VALUES ('11', 'grfdfsd', '1', 'http://placehold.it/50x50/fffccc/123aaa?text=teacher7', '111111111111111111111', '1', '2020-10-13 09:59:06', '1');
INSERT INTO `le_article` VALUES ('12', 'ftrsdc', '1', 'http://placehold.it/50x50/fffccc/123aaa?text=teacher8', '111111111111111111111', '1', '2020-10-13 09:59:06', '1');
INSERT INTO `le_article` VALUES ('13', '111111', '0', 'uploads/8334a4f5961184b826a16ab1b0144bb2.png', 'tttttttttttttttttttttttttttttttttttttttttt', '1', '2020-10-29 12:00:00', '1');
INSERT INTO `le_article` VALUES ('14', '111111rer', '0', 'uploads/8334a4f5961184b826a16ab1b0144bb2.png', '精彩的内容', '2', '2021-01-19 12:00:00', '0');
INSERT INTO `le_article` VALUES ('15', 'kobe', '0', 'uploads/73e164536798472fb317101d40888dda.png', 'kobe kobe mvp', '2', '2020-10-24 02:33:06', '1');
INSERT INTO `le_article` VALUES ('16', 'jame', '0', 'uploads/3485cb48cc46e326bff731b8d3717c7c.png', 'liyi大幅度发到付', '1', '2020-10-24 04:20:50', '1');
INSERT INTO `le_article` VALUES ('17', 'kobe bryant', '0', 'uploads/0b5b8ad4efcee815e945ca05534c094d.png', 'dsfsfsdfsfd', '2', '2020-10-13 12:00:00', '1');
INSERT INTO `le_article` VALUES ('18', 'kate', '0', 'uploads/5b9e4f10ce35f363c823148a34b9a225.png', 'dsfsfsfsdfsdf发送到发送到发送到发送到', '2', '2020-10-24 04:25:22', '1');
INSERT INTO `le_article` VALUES ('19', '天天', '0', 'uploads/2387fc78973c1f293c1f76ad177e36cc.png', '天天可爱', '1', '2020-10-06 12:00:00', '1');

-- ----------------------------
-- Table structure for le_category
-- ----------------------------
DROP TABLE IF EXISTS `le_category`;
CREATE TABLE `le_category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cat_name` varchar(30) DEFAULT NULL,
  `pid` int(11) DEFAULT '0' COMMENT '父级分类',
  `is_show` tinyint(4) DEFAULT '1' COMMENT '0-不显示 1-显示  默认1',
  `add_date` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of le_category
-- ----------------------------
INSERT INTO `le_category` VALUES ('1', '体育', '0', '1', null);
INSERT INTO `le_category` VALUES ('2', '水果', '0', '1', null);
INSERT INTO `le_category` VALUES ('3', '财经', '0', '1', null);

-- ----------------------------
-- Table structure for le_users
-- ----------------------------
DROP TABLE IF EXISTS `le_users`;
CREATE TABLE `le_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) DEFAULT '',
  `password` varchar(50) DEFAULT '0',
  `token` varchar(255) DEFAULT '',
  `sex` tinyint(4) DEFAULT '0' COMMENT '0-未知（默认） 1-男  2-女',
  `openid` varchar(255) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `tel` varchar(20) DEFAULT '0',
  `add_date` datetime DEFAULT NULL,
  `forbidden` tinyint(4) DEFAULT '0' COMMENT '0-账号可用（默认） ，1-不可用',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of le_users
-- ----------------------------
INSERT INTO `le_users` VALUES ('1', 'test', '0', '', '0', null, null, '0', '2020-10-28 09:51:54', '0');
INSERT INTO `le_users` VALUES ('2', 'test2', '0', '', '0', null, null, '0', '2020-10-14 09:52:26', '0');
