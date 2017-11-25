# 2048-game
使用Html，css，js，jQuery 

1.showanimation2048.js --> 动画生成
2.support2048.js  --> 存放判断能否进行移动的逻辑，以及生成数字的颜色和背景颜色，还有存放自适应手机屏幕的变量
3.main2048.js --> 
  存放游戏的初始化，每次移动都更新视图，和生成数字，使用JQuery的keydown函数，当按钮按下时，事件触发。
  事件触发需要判断是哪个方向的按键：
  按钮的keyCode： 37->left. 38->up. 39->right . 40->down.
  根据keyCode进行移动操作。
  
