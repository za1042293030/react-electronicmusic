import { ICreateAlbum, IRawCreateAlbum, IRouterProps, IStyle, IUserSimple } from '@/common/typings';
import { useSetTitle } from '@/hooks';
import { Button, Col, Divider, Form, Input, message, Row, Select, Tabs, Upload } from 'antd';
import React, { FC, Fragment, ReactElement, useEffect, useState } from 'react';
import './index.less';
import { MinusCircleOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { If } from '@/components';
import {
  albumDescribeRule,
  albumNameRule,
  songDescribeRule,
  songNameRule,
} from '@/common/constants/formRule';
import { BASE_URL, TOKEN } from '@/common/constants';
import api from '@/services';

const { TabPane } = Tabs;
const { Option } = Select;

interface IState {
  styles: IStyle[];
  artists: IUserSimple[];
}

const Producer: FC<IRouterProps> = ({ route }): ReactElement => {
  useSetTitle(route.meta?.title);

  const [{ styles, artists }, setState] = useState<IState>({
    styles: [],
    artists: [],
  });

  const onSearchArtist = async (value: string) => {
    const artists = await api.getSelectArtists(value);
    setState(state => ({
      ...state,
      artists: artists ?? [],
    }));
  };

  useEffect(() => {
    (async () => {
      const styles = await api.getSelectStyles();
      setState(state => ({
        ...state,
        styles: styles ?? [],
        artists: artists ?? [],
      }));
      await onSearchArtist('');
    })();
  }, []);

  const onFinish = async (raw: IRawCreateAlbum) => {
    message.loading({
      key: 1,
      content: '上传中，请稍候...',
    });
    const data: ICreateAlbum = {
      ...raw,
      cover: raw.cover.file.response?.data?.id ?? -1,
      songs: raw.songs?.map(item => ({
        ...item,
        cover: item.cover.file.response?.data?.id ?? -1,
        file: item.file.file.response?.data?.id ?? -1,
      })),
    };
    const flag = await api.createAlbum(data);
    message.destroy(1);
    if (flag) {
      message.success('上传成功，审核马上好，3秒后刷新页面');
      setTimeout(() => {
        location.reload();
      }, 3000);
    }
  };

  return (
    <div className='producer'>
      <main className='main'>
        <div className='producer-container'>
          <Tabs defaultActiveKey='1'>
            <TabPane tab='创建专辑' key='1'>
              <Form
                name='basic'
                labelCol={{ span: 2 }}
                wrapperCol={{ span: 22 }}
                onFinish={onFinish}
                autoComplete='off'
              >
                <Form.Item
                  label='专辑名字'
                  name='name'
                  rules={albumNameRule}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  label='专辑描述'
                  name='describe'
                  rules={albumDescribeRule}
                >
                  <Input.TextArea rows={5} />
                </Form.Item>

                <Form.Item
                  label='专辑封面'
                  name='cover'
                  rules={[{ required: true, message: '必须上传封面' }]}
                >
                  <Upload
                    listType='picture-card'
                    action={BASE_URL + '/api/file/uploadImage'}
                    maxCount={1}
                    headers={{
                      token: localStorage.getItem(TOKEN) ?? '',
                    }}
                    name='img'
                  >
                    上传
                  </Upload>
                </Form.Item>

                <Form.List name='songs'>
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map(({ key, name, ...restField }, index) => (
                        <Fragment key={key}>
                          <Row>
                            <Col span={24}>
                              <Divider orientation='left' plain>歌曲{index + 1}</Divider>
                            </Col>
                          </Row>
                          <Row align='middle'>
                            <Col span={22}>
                              <Form.Item
                                {...restField}
                                name={[name, 'name']}
                                rules={songNameRule}
                                label='歌曲名'
                                wrapperCol={{ span: 21 }}
                              >
                                <Input />
                              </Form.Item>
                              <Form.Item
                                {...restField}
                                name={[name, 'describe']}
                                rules={songDescribeRule}
                                label='歌曲描述'
                                wrapperCol={{ span: 21 }}
                              >
                                <Input.TextArea rows={3} />
                              </Form.Item>
                              <Form.Item
                                {...restField}
                                label='歌曲风格'
                                name={[name, 'style']}
                                rules={[{ required: true, message: '必须选择至少一个风格' }]}
                                wrapperCol={{ span: 21 }}
                              >
                                <Select
                                  mode='multiple'
                                  allowClear
                                  filterOption={(input, option) =>
                                    option!.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                  }
                                  maxTagCount={5}
                                  maxTagTextLength={10}
                                >
                                  {
                                    styles.map(style =>
                                      <Option key={style.id} value={style.id}>{style.name}</Option>,
                                    )
                                  }
                                </Select>
                              </Form.Item>
                              <Form.Item
                                {...restField}
                                label='制作人'
                                name={[name, 'artist']}
                                rules={[{ required: true, message: '必须选择至少一个制作人' }]}
                                wrapperCol={{ span: 21 }}
                              >
                                <Select
                                  mode='multiple'
                                  allowClear
                                  filterOption={(input, option) =>
                                    option!.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                  }
                                  onSearch={onSearchArtist}
                                  maxTagCount={6}
                                  maxTagTextLength={10}
                                >
                                  {
                                    artists.map(artist =>
                                      <Option key={artist.id}
                                              value={artist.id}>{artist.nickName}</Option>,
                                    )
                                  }
                                </Select>
                              </Form.Item>
                              <Form.Item
                                {...restField}
                                label='歌曲文件'
                                name={[name, 'file']}
                                rules={[{ required: true, message: '必须上传歌曲' }]}
                              >
                                <Upload
                                  action={BASE_URL + '/api/file/uploadSong'}
                                  maxCount={1}
                                  headers={{
                                    token: localStorage.getItem(TOKEN) ?? '',
                                  }}
                                  name='song'
                                >
                                  <Button icon={<UploadOutlined />}>上传</Button>
                                </Upload>
                              </Form.Item>
                              <Form.Item
                                {...restField}
                                label='歌曲封面'
                                name={[name, 'cover']}
                                rules={[{ required: true, message: '必须上传歌曲封面' }]}
                              >
                                <Upload
                                  listType='picture-card'
                                  action={BASE_URL + '/api/file/uploadImage'}
                                  maxCount={1}
                                  headers={{
                                    token: localStorage.getItem(TOKEN) ?? '',
                                  }}
                                  name='img'
                                >
                                  上传
                                </Upload>
                              </Form.Item>
                            </Col>
                            <Col span={2}>
                              <MinusCircleOutlined onClick={() => remove(name)}
                                                   style={{ fontSize: '3rem' }} />
                            </Col>
                          </Row>
                        </Fragment>
                      ))}
                      <If flag={fields.length <= 20} element1={
                        <Form.Item>
                          <Button type='dashed' onClick={() => add()} icon={<PlusOutlined />}>
                            添加歌曲
                          </Button>
                        </Form.Item>
                      } />
                    </>
                  )}
                </Form.List>
                <Form.Item wrapperCol={{ span: 24 }}>
                  <Button type='primary' htmlType='submit' block>
                    确认上传
                  </Button>
                </Form.Item>
              </Form>
            </TabPane>
          </Tabs>
        </div>
      </main>
    </div>
  );
};
export default Producer;
