// # SimpleServer
// A simple chat bot server
var logger = require('morgan');
var http = require('http');
var bodyParser = require('body-parser');
var express = require('express');
var router = express();

var app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
var server = http.createServer(app);
var request = require("request");

app.get('/', (req, res) => {
  res.send("Home page. Server running okay.");
});

// Đây là đoạn code để tạo Webhook
app.get('/webhook', function(req, res) {
  if (req.query['hub.verify_token'] === 'ma_xac_minh_cua_ban') {
    res.send(req.query['hub.challenge']);
  }
  res.send('Error, wrong validation token');
});

// Xử lý khi có người nhắn tin cho bot
app.post('/webhook', function(req, res) {
  var entries = req.body.entry;
  for (var entry of entries) {
    var messaging = entry.messaging;
    for (var message of messaging) {
      var senderId = message.sender.id;
      if (message.optin) {
          receivedAuthentication(message);
        } else if (message.message) {
          receivedMessage(message);
        } else if (message.delivery) {
          receivedDeliveryConfirmation(message);
        } else if (message.postback) {
          receivedPostback(message);
        } else if (message.read) {
          receivedMessageRead(message);
        } else if (message.account_linking) {
          receivedAccountLink(message);
        } else {
          console.log("Webhook received unknown messagingEvent: ", message);
        }
    }
  }

  res.status(200).send("OK");
});


// Gửi thông tin tới REST API để trả lời
/*
 * Authorization Event
 *
 * The value for 'optin.ref' is defined in the entry point. For the "Send to 
 * Messenger" plugin, it is the 'data-ref' field. Read more at 
 * https://developers.facebook.com/docs/messenger-platform/webhook-reference/authentication
 *
 */
function receivedAuthentication(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfAuth = event.timestamp;

  // The 'ref' field is set in the 'Send to Messenger' plugin, in the 'data-ref'
  // The developer can set this to an arbitrary value to associate the 
  // authentication callback with the 'Send to Messenger' click event. This is
  // a way to do account linking when the user clicks the 'Send to Messenger' 
  // plugin.
  var passThroughParam = event.optin.ref;

  console.log("Received authentication for user %d and page %d with pass " +
    "through param '%s' at %d", senderID, recipientID, passThroughParam, 
    timeOfAuth);

  // When an authentication is received, we'll send a message back to the sender
  // to let them know it was successful.
  sendTextMessage(senderID, "Authentication successful");
}

/*
 * Message Event
 *
 * This event is called when a message is sent to your page. The 'message' 
 * object format can vary depending on the kind of message that was received.
 * Read more at https://developers.facebook.com/docs/messenger-platform/webhook-reference/message-received
 *
 * For this example, we're going to echo any text that we get. If we get some 
 * special keywords ('button', 'generic', 'receipt'), then we'll send back
 * examples of those bubbles to illustrate the special message bubbles we've 
 * created. If we receive a message with an attachment (image, video, audio), 
 * then we'll simply confirm that we've received the attachment.
 * 
 */
function receivedMessage(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfMessage = event.timestamp;
  var message = event.message;

  console.log("Received message for user %d and page %d at %d with message:", 
    senderID, recipientID, timeOfMessage);
  console.log(JSON.stringify(message));

  var isEcho = message.is_echo;
  var messageId = message.mid;
  var appId = message.app_id;
  var metadata = message.metadata;

  // You may get a text or attachment but not both
  var messageText = message.text;
  var messageAttachments = message.attachments;
  var quickReply = message.quick_reply;

  if (isEcho) {
    // Just logging message echoes to console
    console.log("Received echo for message %s and app %d with metadata %s", 
      messageId, appId, metadata);
    return;
  } else if (quickReply) {
    var quickReplyPayload = quickReply.payload;
    console.log("Quick reply for message %s with payload %s",
      messageId, quickReplyPayload);

    sendTextMessage(senderID, "Quick reply tapped");
    return;
  }

  if (messageText) {
      // Event Cung hoàng đạo điểm yếu
      if(messageText.split("",1).some(function(d){return d ==='0' || d === '1' || d === '2' || d === '3'}) == true){
        var arr = messageText.split(""); 
        var day = arr[0] + arr[1]; 
        var mon = arr[2] + arr[3]; 
        var year = arr[4] + arr[5] + arr[6] + arr[7]; 
        if(21 <= day && day <= 31 && mon == 03 || 01 <= day && day <= 19 && mon == 04 ){
          // Cung Bạch Dương
          sendTextMessage(senderID," Bạn thuộc cung Bạch Dương");
          setTimeout(function(){
            sendTextMessage(senderID," Rất tham vọng nên không mấy khi được tận hưởng cảm giác bình yên. Khó yêu nhưng một khi đã yêu thì rất mãnh liệt và dễ bị tình cảm chi phối. Thất thường, dễ nóng nảy, bốc đồng, tự cho bản thân là số 1");
          },1000);
          setTimeout(function(){
            sendTextMessage(senderID," Chơi thêm Quiz này để biết điểm mạnh của cung hoàng đạo của bạn nhé! <3");
          },3000);
          setTimeout(function(){
            sendCunghoangdaoMessage(senderID);
          },4000);
        }else if(20 <= day && day <= 30 && mon == 04 || 01 <= day && day <= 20 && mon == 05 ){
          // Cung Kim ngưu
          sendTextMessage(senderID," Bạn thuộc cung Kim Ngưu");
          setTimeout(function(){
            sendTextMessage(senderID," Ương ngạnh và bướng bỉnh trong tình cảm. Lười biếng, ích kỷ, thường coi trọng vật chất");
          },1000);
          setTimeout(function(){
            sendTextMessage(senderID," Chơi thêm Quiz này để biết điểm mạnh của cung hoàng đạo của bạn nhé! <3");
          },3000);
          setTimeout(function(){
            sendCunghoangdaoMessage(senderID);
          },4000);
        }else if(21 <= day && day <= 31 && mon == 05 || 01 <= day && day <= 21 && mon == 06 ){
          // Cung Song Tử
          sendTextMessage(senderID," Bạn thuộc cung Song Tử");
          setTimeout(function(){
            sendTextMessage(senderID," Hay bồn chồn, lo lắng. Hời hợt, bốc đồng. Không ngay thẳng");
          },1000);
          setTimeout(function(){
            sendTextMessage(senderID," Chơi thêm Quiz này để biết điểm mạnh của cung hoàng đạo của bạn nhé! <3");
          },3000);
          setTimeout(function(){
            sendCunghoangdaoMessage(senderID);
          },4000);
        }else if(22 <= day && day <= 30 && mon == 06 || 01 <= day && day <= 22 && mon == 07 ){
          // Cung Cự Giải
          sendTextMessage(senderID," Bạn thuộc cung Cự Giải");
          setTimeout(function(){
            sendTextMessage(senderID," Tính khí thất thường, khó kiềm chế khi nóng giận. Quá nhạy cảm, dễ bị tổn thương. Thích dựa dẫm, hay suy nghĩ lung tung");
          },1000);
          setTimeout(function(){
            sendTextMessage(senderID," Chơi thêm Quiz này để biết điểm mạnh của cung hoàng đạo của bạn nhé! <3");
          },3000);
          setTimeout(function(){
            sendCunghoangdaoMessage(senderID);
          },4000);
        }else if(23 <= day && day <= 31 && mon == 07 || 01 <= day && day <= 22 && mon == 08 ){
          // Cung Sư Tử
          sendTextMessage(senderID," Bạn thuộc cung Sư Tử");
          setTimeout(function(){
            sendTextMessage(senderID," Dễ mềm lòng với lời nói ngon ngọt, khen ngợi. Độc đoán, khoa trương, cứng đầu, kiêu căng");
          },1000);
          setTimeout(function(){
            sendTextMessage(senderID," Chơi thêm Quiz này để biết điểm mạnh của cung hoàng đạo của bạn nhé! <3");
          },3000);
          setTimeout(function(){
            sendCunghoangdaoMessage(senderID);
          },4000);
        }else if(23 <= day && day <= 31 && mon == 08 || 01 <= day && day <= 22 && mon == 09 ){
          // Cung Xử Nữ
          sendTextMessage(senderID," Bạn thuộc cung Xử Nữ");
          setTimeout(function(){
            sendTextMessage(senderID," Hay nghi ngờ, quá kiểu cách. Hay rụt rè trước người lạ. Quan trọng hóa vấn đề. Cực đoan, dễ bị tổn thương trong tình cảm");
          },1000);
          setTimeout(function(){
            sendTextMessage(senderID," Chơi thêm Quiz này để biết điểm mạnh của cung hoàng đạo của bạn nhé! <3");
          },3000);
          setTimeout(function(){
            sendCunghoangdaoMessage(senderID);
          },4000);
        }else if(23 <= day && day <= 30 && mon == 09 || 01 <= day && day <= 23 && mon == 10 ){
          // Cung Thiên Bình
          sendTextMessage(senderID," Bạn thuộc cung Thiên Bình");
          setTimeout(function(){
            sendTextMessage(senderID," Hay đắn đo, không dứt khoát. Hay mơ mộng hão huyền. Làm gì cũng sợ sai");
          },1000);
          setTimeout(function(){
            sendTextMessage(senderID," Chơi thêm Quiz này để biết điểm mạnh của cung hoàng đạo của bạn nhé! <3");
          },3000);
          setTimeout(function(){
            sendCunghoangdaoMessage(senderID);
          },4000);
        }else if(24 <= day && day <= 31 && mon == 10 || 01 <= day && day <= 22 && mon == 11 ){
          // Cung Thần Nông
          sendTextMessage(senderID," Bạn thuộc cung Thần Nông");
          setTimeout(function(){
            sendTextMessage(senderID," Ghen tuông, hay hoài nghi. Dễ gây ám ảnh, dễ ức chế. Ít nói và che giấu cảm xúc khiến người khác thấy xa cách");
          },1000);
          setTimeout(function(){
            sendTextMessage(senderID," Chơi thêm Quiz này để biết điểm mạnh của cung hoàng đạo của bạn nhé! <3");
          },3000);
          setTimeout(function(){
            sendCunghoangdaoMessage(senderID);
          },4000);
        }else if(23 <= day && day <= 30 && mon == 11 || 01 <= day && day <= 21 && mon == 12 ){
          // Cung Nhân Mã
          sendTextMessage(senderID," Bạn thuộc cung Nhân Mã");
          setTimeout(function(){
            sendTextMessage(senderID," Ham chơi, nói nhiều. Hay dối lòng. Hay vô tình làm tổn thương người khác");
          },1000);
          setTimeout(function(){
            sendTextMessage(senderID," Chơi thêm Quiz này để biết điểm mạnh của cung hoàng đạo của bạn nhé! <3");
          },3000);
          setTimeout(function(){
            sendCunghoangdaoMessage(senderID);
          },4000);
        }else if(22 <= day && day <= 31 && mon == 12 || 01 <= day && day <= 19 && mon == 01 ){
          // Cung Ma Kết
          sendTextMessage(senderID," Bạn thuộc cung Ma Kết");
          setTimeout(function(){
            sendTextMessage(senderID," Tự phụ về bản thân. Hay để mất cơ hội tốt. Quá nghiêm túc, dễ bị ức chế");
          },1000);
          setTimeout(function(){
            sendTextMessage(senderID," Chơi thêm Quiz này để biết điểm mạnh của cung hoàng đạo của bạn nhé! <3");
          },3000);
          setTimeout(function(){
            sendCunghoangdaoMessage(senderID);
          },4000);
        }else if(20 <= day && day <= 31 && mon == 01 || 01 <= day && day <= 18 && mon == 02 ){
          // Cung Bảo Bình
          sendTextMessage(senderID," Bạn thuộc cung Bảo Bình");
          setTimeout(function(){
            sendTextMessage(senderID," Lạnh lùng, vô cảm, cứng đầu. Hay mỉa mai, hay ảo tưởng. Không thích coi trọng quy tắc");
          },1000);
          setTimeout(function(){
            sendTextMessage(senderID," Chơi thêm Quiz này để biết điểm mạnh của cung hoàng đạo của bạn nhé! <3");
          },3000);
          setTimeout(function(){
            sendCunghoangdaoMessage(senderID);
          },4000);
        }else if(19 <= day && day <= 28 && mon == 02 || 01 <= day && day <= 20 && mon == 03 ){
          // Cung Song Ngư
          sendTextMessage(senderID," Bạn thuộc cung Song Ngư");
          setTimeout(function(){
            sendTextMessage(senderID," Thất thường, nhạy cảm quá mức. Trốn tránh thực tế. Lười biếng, hay lưỡng lự");
          },1000);
          setTimeout(function(){
            sendTextMessage(senderID," Chơi thêm Quiz này để biết điểm mạnh của cung hoàng đạo của bạn nhé! <3");
          },3000);
          setTimeout(function(){
            sendCunghoangdaoMessage(senderID);
          },4000);
        }else{
          // Không đúng địng dạng
          console.log("Nhập ngày tháng năm sinh chưa đúng nha! Ví dụ : 05101993");
          sendTextMessage(senderID," Nhập ngày tháng năm sinh chưa đúng nha! Ví dụ : 05101993 hoặc 0510");
        }
      }else if(messageText.split("",1).some(function(d){return d ==='4' || d === '5' || d === '6' || d === '7' || d === '8' || d === '9'}) == true){
          sendTextMessage(senderID," Nhập ngày tháng năm sinh chưa đúng nha! Ví dụ : 05101993 hoặc 0510");
      }else 
      // end cung hoàng đạo
      // If we receive a text message, check to see if it matches any special
      // keywords and send back the corresponding example. Otherwise, just echo
      // the text we received.
      if (messageText.split(" ").some(function(w){return w === 'hello' || w === 'hi' || w === 'chao' || w === 'chào' || w === 'Xinchao' || w === 'hey' || w === 'help' || w === 'hế' || w === 'nhô' || w === 'lô'})==true){
          sendTextMessage(senderID," Hề lú, mình là BOT đẹp trai thanh lịch nhất hành tinh đây");
      }else if(messageText.split(" ").some(function(w){return (w === 'Quiz' || w === 'quiz' || w === 'topquiz' || w === 'Topquiz' || w === 'TOPQUIZ')})==true && messageText.split(" ").some(function(w){return (w === 'là' || w === 'la')})==true && messageText.split(" ").some(function(w){return (w === 'gì' || w === 'gi')})==true){
          sendTextMessage(senderID," Chơi thử là biết nè! ");
          setTimeout(function(){
            sendQuizMessage(senderID);
          },1000);
      }else if(messageText.split(" ").some(function(w){return w === 'Iq' || w === 'iq' || w === 'quiziq'})==true){
          sendTextMessage(senderID," Đợi xíu có ngay cho sếp !");
          setTimeout(function(){
            sendQuizIqMessage(senderID);
          },1000);
      }else if(messageText.split(" ").some(function(w){return w === 'khác' || w === 'khac' || w === 'Khác'})==true && messageText.split(" ").some(function(w){return w === 'biệt' || w === 'biet'})==true){
          sendTextMessage(senderID," Đợi xíu có ngay cho sếp !");
          setTimeout(function(){
            sendQuizKhacbietMessage(senderID);
          },1000);          
      }else if(messageText.split(" ").some(function(w){return w === 'Suy' || w === 'suy'})==true && messageText.split(" ").some(function(w){return w === 'luận' || w === 'luan'})==true){
          sendTextMessage(senderID," Đợi xíu có ngay cho sếp !");
          setTimeout(function(){
            sendQuizSuyluanMessage(senderID);
          },1000);          
      }else if(messageText.split(" ").some(function(w){return w === 'choi' || w === 'chơi' || w === 'Chơi'})==true){
          sendTextMessage(senderID," Đợi xíu có ngay cho sếp !");
          setTimeout(function(){
            sendQuizMessage(senderID);
          },1000);
      }else if(messageText.split(" ").some(function(w){return w === 'ngu' || w === 'dốt' || w === 'stupid' || w === 'đù'})==true){
          sendTextMessage(senderID," Ngu là viết tắt của never give up !!");
          setTimeout(function(){
            sendTextMessage(senderID, "Ad không có ngu đâu nhá, ngu tại con bot thôi ^^");
          },1000);
      }else if(messageText.split(" ").some(function(w){return w === 'ad' || w === 'Ad'})==true && messageText.split(" ").some(function(w){return w === 'ơi' || w === 'oi'})==true){
          sendTextMessage(senderID," BOT đây, có việc gì không bạn ?");
      }else if(messageText.split(" ").some(function(w){return w === 'ad' || w === 'Ad'})==true && messageText.split(" ").some(function(w){return w === 'đâu' || w === 'dau'})==true){
          sendTextMessage(senderID," Ad đang đi vắng, chơi quiz tí đi rồi quay lại hỏi ad nhé");
      }else if(messageText.split(" ").some(function(w){return w === 'ad' || w === 'admin' || w === 'add' || w === 'Ad' || w === 'AD'})==true){
          sendTextMessage(senderID," Bạn muốn biết ad là ai à! Có ngay!");
          setTimeout(function(){
            sendTextMessage(senderID, "Ad là người thông minh, đức độ, đẹp trai, ga lăng, giàu lòng nhân ái ! ^^");
          },2000);
      }else if(messageText.split(" ").some(function(w){return w === 'tks' || w === 'ơn' || w === 'thanks' || w === 'cảm'})==true){
          sendTextMessage(senderID," Không có gì! Lần sau nhớ chơi tiếp nha :))");
      }else if(messageText.split(" ").some(function(w){return (w === 'đang' || w === 'dang')})==true && messageText.split(" ").some(function(w){return (w === 'làm' || w === 'lam')})==true && messageText.split(" ").some(function(w){return (w === 'gì' || w === 'gi')})==true){
          sendTextMessage(senderID," Dạ e đang ngồi chơi quiz, bạn có muốn chơi không ?");
      }else if(messageText.split(" ").some(function(w){return w === 'co' || w === 'có' || w === 'yes' || w === 'vâng'})==true){
          sendTextMessage(senderID," OK! Có ngay cho sếp !");
          setTimeout(function() {
              sendQuizMessage(senderID);
          },1000);
      }else if(messageText.split(" ").some(function(w){return w === 'bot' || w === 'Bot' || w === 'bót' || w === 'pot'})==true && messageText.split(" ").some(function(w){return w === 'ơi' || w === 'oi' || w === 'hỡi' || w === 'ui'})==true){
          sendTextMessage(senderID," BOT đây ! Kêu gì ? ");
      }else if(messageText.split(" ").some(function(w){return w === 'BOT' || w === 'Bot' || w === 'bot'})==true && messageText.split(" ").some(function(w){return w === 'làm' || w === 'lam' || w === 'là' || w === 'gì'})==true && messageText.split(" ").some(function(w){return w === 'gi' || w === 'gì'})==true){
          sendTextMessage(senderID," BOT xuất hiện để mua vui cho bạn nè ");
      }else if(messageText.split(" ").some(function(w){return w === 'BOT' || w === 'Bot' || w === 'bot'})==true && messageText.split(" ").some(function(w){return w === 'điên' || w === 'dien' || w === 'dở' || w === 'hơi'})==true){
          sendTextMessage(senderID," Ok, fineeeeee");
      }else if(messageText.split(" ").some(function(w){return w === 'BOT' || w === 'Bot' || w === 'bot'})==true  && messageText.split(" ").some(function(w){return w === 'la' || w === 'là'})==true && messageText.split(" ").some(function(w){return w === 'người' || w === 'nguoi' || w === 'hả' || w === 'hả'})==true){
          sendTextMessage(senderID," Bot là con bot đẹp trai thanh lịch nhất hành tinh ");
      }else if(messageText.split(" ").some(function(w){return w === 'đm' || w === 'dm'})==true){
          sendTextMessage(senderID," Định mệnh, không được tục tĩu nhá!");
      }else if(messageText.split(" ").some(function(w){return w === 'Clgt' || w === 'clgt'})==true){
          sendTextMessage(senderID," Cậu Làm Gì Thế");
      }else if(messageText.split(" ").some(function(w){return w === 'Vkl' || w === 'vkl'})==true){
          sendTextMessage(senderID," Vui Kười Lên");
      }else if(messageText.split(" ").some(function(w){return w === 'Đkm' || w === 'dkm'})==true){
          sendTextMessage(senderID," Đừng Khóc Mà");
      }else if(messageText.split(" ").some(function(w){return w === 'Cmnr' || w === 'cmnr'})==true){
          sendTextMessage(senderID," Cơm Mẹ Nấu Rồi");
      }else if(messageText.split(" ").some(function(w){return w === '?'})==true){
          sendTextMessage(senderID," Hihi, muốn hỏi gì nào?");
      }else if(messageText.split(" ").some(function(w){return w === 'ê'})==true){
          sendTextMessage(senderID," Ê mình có chuyện gì hơm ?");
      }else if(messageText.split(" ").some(function(w){return w === 'ahihi'})==true){
          sendTextMessage(senderID," Chỉ đứa buê đuê biến thái mới cười ahihi thôi ");
      }else if(messageText.split(" ").some(function(w){return w==='hihi' || w === 'haha' || w === 'Haha' || w === 'kaka' || w === ':)' || w === 'hehe' || w === 'keke' || w === ':D'})==true){
          sendTextMessage(senderID," Cười gì ! Bạn muốn chơi Quiz không?");
      }else if(messageText.split(" ").some(function(w){return w === 'cứu' || w === 'Giúp' || w === 'Cứu' || w === 'Giúp'})==true){
          sendTextMessage(senderID," Có chuyện gì với bạn vậy? Kể mình nghe coi.");
      }else if(messageText.split(" ").some(function(w){return w === 'Buồn' || w === 'buồn' || w === 'bùn' || w === 'buon' || w === 'bun'})==true){
          sendTextMessage(senderID," Tại sao bạn buồn,kể coi :'(");
      }else if(messageText.split(" ").some(function(w){return w === 'Shit' || w === 'cứt' || w === 'phân' || w === 'shit'})==true){
          sendTextMessage(senderID," Ẹc, gớm quá!");
      }else if(messageText.split(" ").some(function(w){return w === 'What' || w === 'Why' || w === 'How' || w === 'Who' || w ==='what' || w ==='why' || w === 'how'})==true){
          sendTextMessage(senderID," Vui lòng nói Tiếng Việt đi bạn ! căn diu sờ pít việt nam i ? kaka");
      }else if(messageText.split(" ").some(function(w){return w === 'lạnh' || w === 'cóng' || w === 'tê' || w === 'đông'})==true){
          sendTextMessage(senderID," Nhớ mặc áo ấm vào nha");
      }else{
        sendTextMessage(senderID," BOT chưa hiểu ý bạn nói, bạn thông cảm nhé !");
      }
      
  }
}

/*
 * Delivery Confirmation Event
 *
 * This event is sent to confirm the delivery of a message. Read more about 
 * these fields at https://developers.facebook.com/docs/messenger-platform/webhook-reference/message-delivered
 *
 */
function receivedDeliveryConfirmation(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var delivery = event.delivery;
  var messageIDs = delivery.mids;
  var watermark = delivery.watermark;
  var sequenceNumber = delivery.seq;

  if (messageIDs) {
    messageIDs.forEach(function(messageID) {
      console.log("Received delivery confirmation for message ID: %s", 
        messageID);
    });
  }

  console.log("All message before %d were delivered.", watermark);
}

/*
 * Postback Event
 *
 * This event is called when a postback is tapped on a Structured Message. 
 * https://developers.facebook.com/docs/messenger-platform/webhook-reference/postback-received
 * 
 */
function receivedPostback(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfPostback = event.timestamp;

  // The 'payload' param is a developer-defined field which is set in a postback 
  // button for Structured Messages. 
  var payload = event.postback.payload;

  console.log("Received postback for user %d and page %d with payload '%s' " + 
    "at %d", senderID, recipientID, payload, timeOfPostback);

  // When a postback is called, we'll send a message back to the sender to 
  // let them know it was successful
  sendTextMessage(senderID, "Vậy bạn có cần mình giúp đỡ gì không ?");
}

/*
 * Message Read Event
 *
 * This event is called when a previously-sent message has been read.
 * https://developers.facebook.com/docs/messenger-platform/webhook-reference/message-read
 * 
 */
function receivedMessageRead(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;

  // All messages before watermark (a timestamp) or sequence have been seen.
  var watermark = event.read.watermark;
  var sequenceNumber = event.read.seq;

  console.log("Received message read event for watermark %d and sequence " +
    "number %d", watermark, sequenceNumber);
}

/*
 * Account Link Event
 *
 * This event is called when the Link Account or UnLink Account action has been
 * tapped.
 * https://developers.facebook.com/docs/messenger-platform/webhook-reference/account-linking
 * 
 */
function receivedAccountLink(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;

  var status = event.account_linking.status;
  var authCode = event.account_linking.authorization_code;

  console.log("Received account link event with for user %d with status %s " +
    "and auth code %s ", senderID, status, authCode);
}
// send API quiz IQ
function sendQuizIqMessage(recipientId){
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [{
            title: "Chấm điểm IQ qua 7 bức ảnh đánh lừa não bộ",
            subtitle: "Liệu tư duy bằng hình ảnh có phải là thế mạnh của bạn?",
            item_url: "http://vi.topquiz.co/quiz/iq/356?ref=mes",               
            image_url:"http://vi.topquiz.co/images/quizz/59881b76f25d4f4e0f7f358d/thumb_720/01.jpg",
            buttons: [{
              type: "web_url",
              url: "http://vi.topquiz.co/quiz/iq/356?ref=mes",
              title: "Chơi Ngay"
            }]
          }, {
            title: "Test chỉ số IQ mới nhất năm 2017",
            subtitle: "Đo chỉ số thông minh của bạn đi nào",
            item_url: "http://vi.topquiz.co/quiz/iq/332?ref=mes",               
            image_url:"http://vi.topquiz.co/images/quizz/596c265bebd38a4b71f1c9c7/thumb_720/00.jpg",
            buttons: [{
              type: "web_url",
              url: "http://vi.topquiz.co/quiz/iq/332?ref=mes",
              title: "Chơi Ngay"
            }]
          },{
            title: "Bài test IQ dự đoán khả năng thành công tương lai của bạn ",
            subtitle: "Chỉ số IQ của bạn là bao nhiêu?",
            item_url: "http://vi.topquiz.co/quiz/iq/326?ref=mes",               
            image_url:"http://vi.topquiz.co/images/quizz/595df76a9b4ca8169d438852/thumb_720/Thumb.jpg",
            buttons: [{
              type: "web_url",
              url: "http://vi.topquiz.co/quiz/iq/326?ref=mes",
              title: "Chơi Ngay"
            }]
          },{
            title: 'Kiểm tra chỉ số IQ siêu chính xác',
            subtitle: '6/10 người chơi không thể vượt qua bài kiểm tra này, bạn dám thử hay không?',
            item_url: "http://vi.topquiz.co/quiz/iq/293?ref=mes",               
            image_url:"http://vi.topquiz.co/images/quizz/5934b65e6e2cb2395995224a/thumb_720/Thumb.jpg",
            buttons: [{
              type: "web_url",
              url: "http://vi.topquiz.co/quiz/iq/293?ref=mes",
              title: "Chơi Ngay"
            }]
          },{
            title: 'IQ màu sắc của bạn đang ở mức nào?',
            subtitle: 'Thách thức khả năng nhận biết và pha trộn màu sắc của bạn.',
            item_url: "http://vi.topquiz.co/quiz/iq/274?ref=mes",               
            image_url:"http://vi.topquiz.co/images/quizz/5923b6ad6c1d991727297138/thumb_720/00.jpg",
            buttons: [{
              type: "web_url",
              url: "http://vi.topquiz.co/quiz/iq/274?ref=mes",
              title: "Chơi Ngay"
            }]
          }]
        }
      }
    }
  };

  callSendAPI(messageData);
}
// send API quiz Điểm khác biệt
function sendQuizKhacbietMessage(recipientId){
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [{
            title: "Tìm hình khác biệt - thách thức đôi mắt tinh anh",
            subtitle: "Luyện 'cơ mắt' với 8 hình ảnh siêu khó ",
            item_url: "http://vi.topquiz.co/quiz/iq/346?ref=mes",               
            image_url:"http://vi.topquiz.co/images/quizz/597eda9c60e83225c0407218/thumb_720/00.jpg",
            buttons: [{
              type: "web_url",
              url: "http://vi.topquiz.co/quiz/iq/346?ref=mes",
              title: "Chơi Ngay"
            }]
          }, {
            title: "Bài test thị giác 90% dân số phải bó tay",
            subtitle: "Kiểm tra thị giác của bạn thông qua thử thách tìm điểm khác biệt, bạn dám thử hay không?",
            item_url: "http://vi.topquiz.co/quiz/iq/333?ref=mes",               
            image_url:"http://vi.topquiz.co/images/quizz/596edf466f95416457283f74/thumb_720/Thumb.jpg",
            buttons: [{
              type: "web_url",
              url: "http://vi.topquiz.co/quiz/iq/333?ref=mes",
              title: "Chơi Ngay"
            }]
          },{
            title: "Thách thức tìm điểm khác biệt - Bạn dám thử hay không? ",
            subtitle: "Liệu bạn có thể tìm ra điểm khác biệt trong 7 bức hình mà 90% dân số thế giới phải bó tay?",
            item_url: "http://vi.topquiz.co/quiz/iq/312?ref=mes",               
            image_url:"http://vi.topquiz.co/images/quizz/594a237240815e08eb8271a6/thumb_720/Thumb.jpg",
            buttons: [{
              type: "web_url",
              url: "http://vi.topquiz.co/quiz/iq/312?ref=mes",
              title: "Chơi Ngay"
            }]
          },{
            title: 'Thử thách sự tỉ mỉ thông qua 10 hình ảnh siêu rối',
            subtitle: 'Muốn biết mình có tỉ mỉ không, hãy tìm hình khác biệt trong các hình sau',
            item_url: "http://vi.topquiz.co/quiz/iq/278?ref=mes",               
            image_url:"http://vi.topquiz.co/images/quizz/5923eea0e88b85198ea9a204/thumb_720/thumb.jpg",
            buttons: [{
              type: "web_url",
              url: "http://vi.topquiz.co/quiz/iq/278?ref=mes",
              title: "Chơi Ngay"
            }]
          },{
            title: 'Chỉ người có con mắt thứ 3 mới có thể vượt qua loạt câu hỏi này',
            subtitle: 'Hãy hít thật sâu trước khi chơi vì bạn chỉ có 10s thôi.',
            item_url: "http://vi.topquiz.co/quiz/iq/323?ref=mes",               
            image_url:"http://vi.topquiz.co/images/quizz/595af5e39b4ca8169d4387eb/thumb_720/thumb.jpg",
            buttons: [{
              type: "web_url",
              url: "http://vi.topquiz.co/quiz/iq/323?ref=mes",
              title: "Chơi Ngay"
            }]
          }]
        }
      }
    }
  };

  callSendAPI(messageData);
}
// send API quiz suy luận
function sendQuizSuyluanMessage(recipientId){
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [{
            title: '6 câu hỏi "xoắn não" phải vượt qua để gia nhập FBI',
            subtitle: "Khả năng suy luận và quan sát thật tốt mới mong vượt qua bài test này",
            item_url: "http://vi.topquiz.co/quiz/352?ref=mes",               
            image_url:"http://vi.topquiz.co/images/quizz/59802ef9ee0226140ab25d9b/thumb_720/thumb.jpeg",
            buttons: [{
              type: "web_url",
              url: "http://vi.topquiz.co/quiz/352?ref=mes",
              title: "Chơi Ngay"
            }]
          }, {
            title: "Kiểm tra độ nhạy bén trong suy luận của bạn",
            subtitle: "Trả lời được 5/6 thì bạn chắc chắn là một thiên tài",
            item_url: "http://vi.topquiz.co/quiz/iq/344?ref=mes",               
            image_url:"http://vi.topquiz.co/images/quizz/597814a5eb23f21020b46fc5/thumb_720/Untitled-2.jpg",
            buttons: [{
              type: "web_url",
              url: "http://vi.topquiz.co/quiz/iq/344?ref=mes",
              title: "Chơi Ngay"
            }]
          },{
            title: "Khả năng suy luận của bạn có tốt hơn cậu bé Conan?",
            subtitle: "Hãy coi mình là nhà thám tử và phá các vụ án sau",
            item_url: "http://vi.topquiz.co/quiz/334?ref=mes",               
            image_url:"http://vi.topquiz.co/images/quizz/596f0ffbe7bd3066a3eb26d8/thumb_720/00.jpg",
            buttons: [{
              type: "web_url",
              url: "http://vi.topquiz.co/quiz/334?ref=mes",
              title: "Chơi Ngay"
            }]
          },{
            title: 'Bạn có vượt qua bài test để trở thành CIA không?',
            subtitle: 'Muốn biết mình có tỉ mỉ không, hãy tìm hình khác biệt trong các hình sau',
            item_url: "http://vi.topquiz.co/quiz/288?ref=mes",               
            image_url:"http://vi.topquiz.co/images/quizz/592bcffe53f3ee3026ae290a/thumb_720/THUMB.jpg",
            buttons: [{
              type: "web_url",
              url: "http://vi.topquiz.co/quiz/288?ref=mes",
              title: "Chơi Ngay"
            }]
          },{
            title: 'Bạn có phải là thiên tài suy luận?',
            subtitle: '87% dân số thế giới không thể hoàn thành bài kiểm tra suy luận này với số điểm tối đa. Bạn thì sao?',
            item_url: "http://vi.topquiz.co/quiz/iq/301?ref=mes",               
            image_url:"http://vi.topquiz.co/images/quizz/593e5b7e020dfa4fbf08e6b6/thumb_720/Thumb.jpg",
            buttons: [{
              type: "web_url",
              url: "http://vi.topquiz.co/quiz/iq/301?ref=mes",
              title: "Chơi Ngay"
            }]
          }]
        }
      }
    }
  };

  callSendAPI(messageData);
}
// send API cung hoàng đạo
function sendCunghoangdaoMessage(recipientId){
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [{
            title: "Ưu điểm tuyệt vời nhất của 12 cung hoàng đạo là gì?",
            subtitle: "Khám phá ưu điểm bản thân qua cung hoàng đạo nhé!",
            item_url: "http://vi.topquiz.co/quiz/99?utm_source=message&ref=mes",               
            image_url:"http://vi.topquiz.co/public/images/uploads/thumb/quiz_1470906602000/large_quiz_1470906602000.jpeg",
            buttons: [{
              type: "web_url",
              url: "http://vi.topquiz.co/quiz/99?utm_source=message&ref=mes",
              title: "Chơi Ngay"
            }]
          },{
            title: "Cung hoàng đạo nào sẽ mang lại may mắn cho bạn?",
            subtitle: "Tìm cho mình một cung hoàng đạo hợp cạ để mang may mắn đến cho nhau nào!",
            item_url: "http://vi.topquiz.co/quiz/34?utm_source=message&ref=mes",               
            image_url:"http://vi.topquiz.co/public/images/uploads/thumb/quiz_1471916713000/large_quiz_1471916713000.jpeg",
            buttons: [{
              type: "web_url",
              url: "http://vi.topquiz.co/quiz/34?utm_source=message&ref=mes",
              title: "Chơi Ngay"
            }]
          },{
            title: "Nếu sống trong Hoàng Cung, bạn sẽ là ai?",
            subtitle: "Lỡ một ngày như thế thật thì sao nhỉ?",
            item_url: "http://vi.topquiz.co/quiz/81?utm_source=message&ref=mes",               
            image_url:"http://vi.topquiz.co/public/images/uploads/thumb/quiz_1474528422000/large_quiz_1474528422000.jpeg",
            buttons: [{
              type: "web_url",
              url: "http://vi.topquiz.co/quiz/81?utm_source=message&ref=mes",
              title: "Chơi Ngay"
            }]
          }]
        }
      }
    }
  };

  callSendAPI(messageData);
}
/*
 * Send an image using the Send API.
 *
 */
function sendImageMessage(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "image",
        payload: {
          url: "https://giphy.com/gifs/dog-shiba-inu-typing-mCRJDo24UvJMA"
        }
      }
    }
  };

  callSendAPI(messageData);
}

/*
 * Send an image using the Send API.
 *
 */
function sendHelloMessage(recipientId, messageText) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: "Chào bạn! Mình có thể giúp gì cho bạn?",
      metadata: "Chào bạn! Mình có thể giúp gì cho bạn?"
    }
  };
  
  callSendAPI(messageData);
}

/*
 * Send an quiz using the Send API.
 *
 */
function sendQuizMessage(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [{
            title: "Thách thức tìm điểm khác biệt - Bạn dám thử hay không?",
            subtitle: "Liệu bạn có thể tìm ra điểm khác biệt trong 7 bức hình mà 90% dân số thế giới phải bó tay?",
            item_url: "http://vi.topquiz.co/quiz/iq/312?ref=mes",               
            image_url:"http://vi.topquiz.co/images/quizz/594a237240815e08eb8271a6/thumb_720/Thumb.jpg",
            buttons: [{
              type: "web_url",
              url: "http://vi.topquiz.co/quiz/iq/312?ref=mes",
              title: "Chơi Ngay"
            }, {
              type: "postback",
              title: "Để Sau",
              payload: "Bạn có muốn chơi quiz khác không ?",
            }],
          }, {
            title: "Trực giác của bạn mạnh mẽ đến đâu?",
            subtitle: "Khám phá giác quan thứ 6 trong bạn",
            item_url: "http://vi.topquiz.co/quiz/iq/320?ref=mes",               
            image_url:"http://vi.topquiz.co/images/quizz/59530fde9b4ca8169d4387b6/thumb_720/THUMB.jpg",
            buttons: [{
              type: "web_url",
              url: "http://vi.topquiz.co/quiz/iq/320?ref=mes",
              title: "Chơi Ngay"
            }, {
              type: "postback",
              title: "Để sau",
              payload: "Bạn có muốn chơi quiz khác không ?",
            }]
          },{
            title: "Đo mắt với loạt hình ảnh siêu khó",
            subtitle: "Không chỉ tinh mắt mà còn phải có trí tưởng tượng bay xa bay cao nữa mới đạt điểm tối đa đấy nhé!",
            item_url: "http://vi.topquiz.co/quiz/iq/279?ref=mes",               
            image_url:"http://vi.topquiz.co/images/quizz/5924fcebe88c7f1aa8dd50f8/thumb_720/Thumb.jpg",
            buttons: [{
              type: "web_url",
              url: "http://vi.topquiz.co/quiz/iq/279?ref=mes",
              title: "Chơi Ngay"
            }, {
              type: "postback",
              title: "Để Sau",
              payload: "Bạn có muốn chơi quiz khác không ?",
            }],
          },{
            title: 'Đo độ "tỉnh" với 9 hình ảnh gây ảo giác',
            subtitle: 'Chỉ có thánh "tỉnh" mới không bị lừa',
            item_url: "http://vi.topquiz.co/quiz/216?ref=mes",               
            image_url:"http://vi.topquiz.co/public/images/uploads/thumb/quiz_1486346927000/large_quiz_1486346927000.jpeg",
            buttons: [{
              type: "web_url",
              url: "http://vi.topquiz.co/quiz/216?ref=mes",
              title: "Chơi Ngay"
            }, {
              type: "postback",
              title: "Để Sau",
              payload: "Bạn có muốn chơi quiz khác không ?",
            }],
          },{
            title: "Thiên tài sử dụng trên 10% não bộ để trả lời 9 câu này",
            subtitle: "Kiểm tra xem mình có tố chất của một thiên tài không nào!",
            item_url: "http://vi.topquiz.co/quiz/iq/290?ref=mes",               
            image_url:"http://vi.topquiz.co/images/quizz/592cee0bb92ede305f0067ae/thumb_720/Thumb.jpg",
            buttons: [{
              type: "web_url",
              url: "http://vi.topquiz.co/quiz/iq/290?ref=mes",
              title: "Chơi Ngay"
            }, {
              type: "postback",
              title: "Để Sau",
              payload: "Bạn có muốn chơi quiz khác không ?",
            }],
          }]
        }
      }
    }
  };

  callSendAPI(messageData);
}
/*
 * Send a Gif using the Send API.
 *
 */
function sendGifMessage(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "image",
        payload: {
          url: "https://giphy.com/gifs/dog-shiba-inu-typing-mCRJDo24UvJMA"
        }
      }
    }
  };

  callSendAPI(messageData);
}
/*
 * Send a text message using the Send API.
 *
 */
function sendTextMessage(recipientId, messageText) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText,
      metadata: "DEVELOPER_DEFINED_METADATA"
    }
  };

  callSendAPI(messageData);
}

/*
 * Send a button message using the Send API.
 *
 */
function sendButtonMessage(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "button",
          text: "This is test text",
          buttons:[{
            type: "web_url",
            url: "http://vi.topquiz.co",
            title: "Open Web URL"
          }, {
            type: "postback",
            title: "Trigger Postback",
            payload: "DEVELOPER_DEFINED_PAYLOAD"
          }, {
            type: "phone_number",
            title: "Call Phone Number",
            payload: "+16505551234"
          }]
        }
      }
    }
  };  

  callSendAPI(messageData);
}

/*
 * Send a Structured Message (Generic Message type) using the Send API.
 *
 */
function sendGenericMessage(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [{
            title: "rift",
            subtitle: "Next-generation virtual reality",
            item_url: "https://www.oculus.com/en-us/rift/",               
            image_url:"http://vi.topquiz.co/images/resources/thumb.png",
            buttons: [{
              type: "web_url",
              url: "https://www.oculus.com/en-us/rift/",
              title: "Open Web URL"
            }, {
              type: "postback",
              title: "Call Postback",
              payload: "Payload for first bubble",
            }],
          }, {
            title: "touch",
            subtitle: "Your Hands, Now in VR",
            item_url: "https://www.oculus.com/en-us/touch/",               
            image_url:"http://vi.topquiz.co/images/resources/thumb.png",
            buttons: [{
              type: "web_url",
              url: "https://www.oculus.com/en-us/touch/",
              title: "Open Web URL"
            }, {
              type: "postback",
              title: "Call Postback",
              payload: "Payload for second bubble",
            }]
          }]
        }
      }
    }
  };  

  callSendAPI(messageData);
}

/*
 * Send a receipt message using the Send API.
 *
 */
function sendReceiptMessage(recipientId) {
  // Generate a random receipt ID as the API requires a unique ID
  var receiptId = "order" + Math.floor(Math.random()*1000);

  var messageData = {
    recipient: {
      id: recipientId
    },
    message:{
      attachment: {
        type: "template",
        payload: {
          template_type: "receipt",
          recipient_name: "Peter Chang",
          order_number: receiptId,
          currency: "USD",
          payment_method: "Visa 1234",        
          timestamp: "1428444852", 
          elements: [{
            title: "Oculus Rift",
            subtitle: "Includes: headset, sensor, remote",
            quantity: 1,
            price: 599.00,
            currency: "USD",
            image_url: "http://vi.topquiz.co/images/resources/thumb.png"
          }, {
            title: "Samsung Gear VR",
            subtitle: "Frost White",
            quantity: 1,
            price: 99.99,
            currency: "USD",
            image_url:"http://vi.topquiz.co/images/resources/thumb.png"
          }],
          address: {
            street_1: "1 Hacker Way",
            street_2: "",
            city: "Menlo Park",
            postal_code: "94025",
            state: "CA",
            country: "US"
          },
          summary: {
            subtotal: 698.99,
            shipping_cost: 20.00,
            total_tax: 57.67,
            total_cost: 626.66
          },
          adjustments: [{
            name: "New Customer Discount",
            amount: -50
          }, {
            name: "$100 Off Coupon",
            amount: -100
          }]
        }
      }
    }
  };

  callSendAPI(messageData);
}

/*
 * Send a message with Quick Reply buttons.
 *
 */
function sendQuickReply(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: "What's your favorite movie genre?",
      quick_replies: [
        {
          "content_type":"text",
          "title":"Action",
          "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_ACTION"
        },
        {
          "content_type":"text",
          "title":"Comedy",
          "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_COMEDY"
        },
        {
          "content_type":"text",
          "title":"Drama",
          "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_DRAMA"
        }
      ]
    }
  };

  callSendAPI(messageData);
}

/*
 * Send a read receipt to indicate the message has been read
 *
 */
function sendReadReceipt(recipientId) {
  console.log("Sending a read receipt to mark message as seen");

  var messageData = {
    recipient: {
      id: recipientId
    },
    sender_action: "mark_seen"
  };

  callSendAPI(messageData);
}

/*
 * Call the Send API. The message data goes in the body. If successful, we'll 
 * get the message id in a response 
 *
 */
function callSendAPI(messageData) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: "EAACsShWygokBANHJ1mHJ7ZAaSxNZB4afTrHxsP9r6XHOGexZB3ZA4qUB3WNjzWneahL0EWlvIVloeYFzmWLTDPCJEqVDhxdt85dwrwe2Kb7kzQ9rf587LTsVwd5HmaDUpbAtZAMVZCnreZBno8QbZAB8iw0pPUwaDXMR4ZAzdN7sTWQZDZD"},
    method: 'POST',
    json: messageData

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var recipientId = body.recipient_id;
      var messageId = body.message_id;

      if (messageId) {
        console.log("Successfully sent message with id %s to recipient %s", 
          messageId, recipientId);
      } else {
      console.log("Successfully called Send API for recipient %s", 
        recipientId);
      }
    } else {
      console.error("Failed calling Send API", response.statusCode, response.statusMessage, body.error);
    }
  });  
}

function sendMessage(senderId, message) {
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {
      access_token: "EAACsShWygokBANHJ1mHJ7ZAaSxNZB4afTrHxsP9r6XHOGexZB3ZA4qUB3WNjzWneahL0EWlvIVloeYFzmWLTDPCJEqVDhxdt85dwrwe2Kb7kzQ9rf587LTsVwd5HmaDUpbAtZAMVZCnreZBno8QbZAB8iw0pPUwaDXMR4ZAzdN7sTWQZDZD",
    },
    method: 'POST',
    json: {
      recipient: {
        id: senderId
      },
      message: {
        text: message
      },
    }
  });
}

app.set('port', process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 3002);
app.set('ip', process.env.OPENSHIFT_NODEJS_IP || process.env.IP || "127.0.0.1");

server.listen(app.get('port'), app.get('ip'), function() {
  console.log("Chat bot server listening at %s:%d ", app.get('ip'), app.get('port'));
});