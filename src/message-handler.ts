import { get } from 'lodash';
import {
  Client,
  MessageEvent,
  TextEventMessage,
  ImageEventMessage,
  AudioEventMessage,
  LocationEventMessage,
  VideoEventMessage,
  StickerEventMessage,
  StickerMessage,
} from '@line/bot-sdk';

import { LINE_VERIFY_TOKEN } from './config';
import { DialogflowClient } from './dialogflow-client';

export class MessageHandler {

  constructor(
    private readonly lineClient: Client,
    private readonly dialogflowClient: DialogflowClient) {
  }

  /**
   * All Message Handler
   */
  async handleText(event: MessageEvent) {
    const replyToken = get(event, 'replyToken');
    if (replyToken === LINE_VERIFY_TOKEN) return;
    const userId = get(event, ['source', 'userId']);
    const message: TextEventMessage = get(event, 'message');
    const messageText = get(message, 'text');
    console.log('messageText', messageText);

    const lineMessages = await this.dialogflowClient.sendText(userId, messageText);
    console.log('lineMessage', lineMessages);
    const cleaned = lineMessages.filter(x => x != null);
    return this.lineClient.replyMessage(replyToken, cleaned);
  }

  async handleImage(event: MessageEvent) {
    const replyToken = get(event, 'replyToken');
    const message: ImageEventMessage = get(event, 'message');

    console.log(`Handle Image: ${JSON.stringify(message)}`);
    return this.lineClient.replyMessage(replyToken, [{ type: 'text', text: 'ว้าว รูปสวยจัง' }]);
  }

  async handleVideo(event: MessageEvent) {
    const replyToken = get(event, 'replyToken');
    const message: VideoEventMessage = get(event, 'message');

    console.log(`Handle Video: ${JSON.stringify(message)}`);
    return this.lineClient.replyMessage(replyToken, [{ type: 'text', text: 'วีดีโอ น่าสนใจมากค่ะ' }]);
  }

  async handleAudio(event: MessageEvent) {
    const replyToken = get(event, 'replyToken');
    const message: AudioEventMessage = get(event, 'message');

    console.log(`Handle Audio: ${JSON.stringify(message)}`);
    return this.lineClient.replyMessage(replyToken, [{ type: 'text', text: 'เสียงพี่เพราะจัง' }]);
  }

  async handleLocation(event: MessageEvent) {
    const replyToken = get(event, 'replyToken');
    const message: LocationEventMessage = get(event, 'message');

    console.log(`Handle Location: ${JSON.stringify(message)}`);
    return this.lineClient.replyMessage(replyToken, [{ type: 'text', text: 'อ๋า พี่อยู่ที่นี่หรอ เดี๋ยวหนูไปเข้าฝันนะ' }]);
  }

  async handleSticker(event: MessageEvent) {
    const replyToken = get(event, 'replyToken');
    const message: StickerEventMessage = get(event, 'message');

    console.log(`Handle Sticker: ${JSON.stringify(message)}`);

    let replySticker: StickerMessage;
    replySticker = { type:'sticker',stickerId:'51626496',packageId:'11538' };
    return this.lineClient.replyMessage(replyToken, [replySticker]);
  }

}
