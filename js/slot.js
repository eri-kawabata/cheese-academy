//HTMLページから要素を取得し、スロットマシンの機能を実現するための基礎となる変数を定義
let slot_frame = document.getElementById("slot-frame");  //slot_frame：idがslot-frameの要素を取得。スロットのフレームとなる要素に使われ、スロットの領域を示す役割
let reel = document.getElementsByClassName("reel");  //reel：クラス名reelを持つすべての要素を取得する。getElementsByClassNameはHTMLCollection（配列のようなオブジェクト）を返すため、複数のリール画像や要素を管理する場合に使用される
let reels = document.getElementsByClassName("reels");//reels：クラス名reelsを持つすべての要素を取得します。スロットマシンの各リール全体を管理するための要素
let start_btn = document.getElementById("start-btn");//start_btn：idがstart-btnの要素を取得し、スタートボタンとして設定。クリック時にスロットマシンが回転を開始するボタンとして利用される
let stop_btn = document.getElementsByClassName("stop-btn"); //stop_btn：クラス名stop-btnを持つすべての要素を取得し、ストップボタンとして設定。getElementsByClassNameを使用することで、複数のストップボタンが取得され、クリック時にそれぞれのリールを停止する役割を持たせることができる

//スロットマシンの動作に必要な変数を定義
let sec = 80;  //スロットのリール実行毎秒数
let stopReelFlag = [];  //stopReelFlag[i]がtrueになると、リールが停止
let reelContents = [];   //各リールの表示されている画像の位置情報や順序を管理し、アニメーションで使用するための配列
let slotFrameHeight;    //スロットのリールがフレーム内に収まるように表示位置を計算するのに使用される
let slotReelsHeight;   //リール画像の全体の大きさ
let slotReelItemHeight;   //リール１個の大きさ
let slotReelStartHeight;  //リールが回転を開始する初期の高さ

let Slot = {
    init: function () {   //初期化
        stopReelFlag[0] = stopReelFlag[1] = stopReelFlag[2] = false;
        //各リールのstopReelFlagをfalseに設定し、回転を止めない状態する
        reelContents[0] = reelContents[1] = reelContents[2] = 0;
        //reelContentsを0に設定し、初期位置で画像が中央に表示されるようにする
    },
    start: function () {   //クリックイベント
        Slot.init();  //スロットマシンをリセットし、各リールを回転させる
        for (let index = 0; index < 3; index++) {
            Slot.animation(index);  //3つのリールそれぞれにanimationを適用して動作を開始
        }
    },
    stop: function (i) {    //ストップボタンのクリックイベント
        stopReelFlag[i] = true;  //指定したリールを停止するため、stopReelFlag[i]をtrueに設定
        if (stopReelFlag[0] && stopReelFlag[1] && stopReelFlag[2]) {
            start_btn.removeAttribute("disabled");   //3つのリール全てが停止した場合、スタートボタンが再び使用できるように
        }
    },
    resetLocationInfo: function () {  //初期の位置を設定
        slotFrameHeight = slot_frame.offsetHeight; //フレーム（slot-frame）の高さを取得
        slotReelsHeight = reels[0].offsetHeight;  //リールのコンテナ（reels）全体の高さを取得
        slotReelItemHeight = reel[0].offsetHeight; //リール内の画像1つ分の高さを取得
        slotReelStartHeight = -slotReelsHeight;   //slotReelStartHeight**を最初に-slotReelsHeightとして設定。これはリール画像の一番上がフレームの外部、上部に配置されるように
        slotReelStartHeight = slotReelStartHeight + slotFrameHeight
            //画像末端がフレームのトップ   画像末端がフレームの末端
            - (slotFrameHeight / 2) + slotReelItemHeight * 3 / 2;
        //slotFrameHeightを基に、フレームの中央がどこかを計算し、リールの画像の1.5枚分が中央に見えるように微調整
        for (let i = 0; i < reels.length; i++) {
            reels[i].style.top = String(slotReelStartHeight) + "px";
        } //各リールの画像がフレームの中央に表示されるように位置調整を行い、各リールのtopプロパティをセットしている
    },
    animation: function (index) {     //スロットを動かす
        if (reelContents[index] >= 8) {  //reelContents[index]が8以上になった場合、0に戻してループさせます。
            reelContents[index] = 0;
        }
        //animation(CSSプロパティ、速度、イージング関数名、アニメーション完了後に実行する関数)
        $('.reels').eq(index).animate({
            'top': slotReelStartHeight + (reelContents[index] * slotReelItemHeight)
            //  indexが増える度に画像が一つ分下がる
        }, {
            duration: sec,  //回転速度
            easing: 'linear',    //常に一定の速度
            complete: function () {
                if (stopReelFlag[index]) {   //stopReelFlag[index]がtrueになるまでループ
                    return;
                }
                reelContents[index]++;
                Slot.animation(index);
            }
        });
    },
};

window.onload = function () {
    Slot.init();
    Slot.resetLocationInfo();
    start_btn.addEventListener("click", function (e) {
        e.target.setAttribute("disabled", true)  //スタートボタンを無効化
        Slot.start();
        for (let i = 0; i< stop_btn.length; i++) {
            stop_btn[i].removeAttribute("disabled");  //ストップボタンを機能させる
        }
    });
    for (let i = 0; i < stop_btn.length; i++) {
        stop_btn[i].addEventListener("click", function (e) {
            Slot.stop(e.target.getAttribute('data-val'));  //どのボタンをストップさせるか
        })
    }
};

