export default {
  install: (app, options) => {
    app.directive('steven-draggable', function stevenDraggableDirective(el, { value: dragzone }) {
      el.onmousedown = function onDragStart(mouseDownEvent) {
        // 拖动目标
        const dragTarget = mouseDownEvent.target;

        // 拖动区域 -- 默认为拖动目标的父节点
        const dragZone = document.querySelector(dragzone) || dragTarget.parentNode;

        // 初始定位 -- 用于拖动结束后恢复
        const dragTargetOldPosition = dragTarget.style.position;
        const dragTargetOldOffsetX = dragTarget.style.left;
        const dragTargetOldOffsetY = dragTarget.style.top;

        // 全局监听
        document.onmousemove = function (mouseMoveEvent) {
          let dragTargetX = mouseMoveEvent.pageX - mouseDownEvent.offsetX;
          let dragTragetY = mouseMoveEvent.pageY - mouseDownEvent.offsetY;

          const boundingRect = dragZone.getBoundingClientRect();

          // X边界判断 - 左边界
          dragTargetX = dragTargetX < boundingRect.left ? boundingRect.left : dragTargetX;

          // X边界判断 - 右边界
          if (dragTargetX + dragTarget.offsetWidth > boundingRect.right) {
            dragTargetX = boundingRect.right - dragTarget.offsetWidth;
          }

          // Y边界判断 - 上边界
          dragTragetY = dragTragetY < boundingRect.top ? boundingRect.top : dragTragetY;

          // Y边界判断 - 下边界
          if (dragTragetY + dragTarget.offsetHeight > boundingRect.bottom) {
            dragTragetY = boundingRect.bottom - dragTarget.offsetHeight;
          }

          // 更新坐标
          dragTarget.style.left = dragTargetX + 'px';
          dragTarget.style.top = dragTragetY + 'px';

          // 切换定位 position = absolute
          dragTarget.style.position = 'absolute';
        };

        // 拖动结束
        document.onmouseup = document.onmouseleave = function () {
          // 恢复初始定位
          dragTarget.style.position = dragTargetOldPosition;
          dragTarget.style.left = dragTargetOldOffsetX;
          dragTarget.style.top = dragTargetOldOffsetY;

          // 监听清理
          document.onmousemove = null;
          document.onmouseup = null;
          document.onmouseleave = null;
        };
      };
    });
  }
};
