export default {
  install: (app, options) => {
    const droppableRegister = new Map();
    let transferData = null;
    let droppingTarget = null;
    let droppingOption = null;

    app.directive('steven-draggable', {
      mounted: (el, bindings) => {
        let dragOptions = {
          dragZone: undefined,
          onDragStart: undefined,
          onDragEnd: undefined
        };

        // helpers
        if (typeof bindings.value === 'string') dragOptions['dragZone'] = bindings.value;
        if (typeof bindings.value === 'object') dragOptions = bindings.value;

        el.onmousedown = function onDragStart(mouseDownEvent) {
          // 拖动目标
          const dragTarget = mouseDownEvent.target;

          // 拖动区域 -- 默认为拖动目标的父节点
          const dragZone = document.querySelector(dragOptions.dragZone) || dragTarget.parentNode;

          // 初始定位 -- 用于拖动结束后恢复
          const dragTargetOldPosition = dragTarget.style.position;
          const dragTargetPointerEvents = dragTarget.style.pointerEvents;
          const dragTargetOldOffsetX = dragTarget.style.left;
          const dragTargetOldOffsetY = dragTarget.style.top;

          // 拖动初开始状态
          let isDragging = false;

          // 拖动事件禁用
          dragTarget.style.pointerEvents = 'none';

          // 获取DragLoc对象信息
          function getDragStatus() {
            return {
              top: dragTarget.style.top,
              left: dragTarget.style.left
            };
          }

          // 获取DragTransfer对象信息
          function getDropStatus() {
            return {
              transferData,
              loc: getDragStatus()
            };
          }

          // 拖动开始
          document.onmousemove = function (mouseMoveEvent) {
            // 开始拖动
            if (!isDragging && dragOptions.onDragStart) {
              transferData = dragOptions.onDragStart();
            }

            isDragging = true;

            let dragTargetX = mouseMoveEvent.pageX - mouseDownEvent.offsetX;
            let dragTargetY = mouseMoveEvent.pageY - mouseDownEvent.offsetY;

            const probingTarget = document.elementFromPoint(dragTargetX, dragTargetY);
            const boundingRect = dragZone.getBoundingClientRect();

            // X边界判断 - 左边界
            dragTargetX = dragTargetX < boundingRect.left ? boundingRect.left : dragTargetX;

            // X边界判断 - 右边界
            if (dragTargetX + dragTarget.offsetWidth > boundingRect.right) {
              dragTargetX = boundingRect.right - dragTarget.offsetWidth;
            }

            // Y边界判断 - 上边界
            dragTargetY = dragTargetY < boundingRect.top ? boundingRect.top : dragTargetY;

            // Y边界判断 - 下边界
            if (dragTargetY + dragTarget.offsetHeight > boundingRect.bottom) {
              dragTargetY = boundingRect.bottom - dragTarget.offsetHeight;
            }

            // 更新坐标
            dragTarget.style.left = dragTargetX + 'px';
            dragTarget.style.top = dragTargetY + 'px';

            // 切换定位 position = absolute
            dragTarget.style.position = 'absolute';

            // 目标探测
            const currentDroppableInfo = droppableRegister.get(probingTarget);

            // onDragEnter
            if (!droppingOption && currentDroppableInfo) {
              if (currentDroppableInfo.onDragEnter)
                currentDroppableInfo.onDragEnter(getDropStatus());
            }

            // onDragOver
            if (droppingOption && droppingOption === currentDroppableInfo) {
              if (droppingOption.onDragOver) droppingOption.onDragOver(getDropStatus());
            }

            // onDragLeave
            if (droppingOption && droppingOption !== currentDroppableInfo) {
              if (droppingOption.onDragLeave) droppingOption.onDragLeave(getDropStatus());
            }

            droppingOption = currentDroppableInfo;
            droppingTarget = currentDroppableInfo ? probingTarget : null;
          };

          // 拖动结束
          window.onblur = document.onmouseup = function () {
            // 监听清理
            document.onmousemove = window.onblur = document.onmouseup = null;

            // onDrop
            if (droppingOption && droppingOption.onDrop) {
              droppingOption.onDrop(getDropStatus());
            }

            // onDragEnd
            if (isDragging && dragOptions.onDragEnd) {
              dragOptions.onDragEnd(getDragStatus());
            }

            // 恢复初始定位
            dragTarget.style.position = dragTargetOldPosition;
            dragTarget.style.pointerEvents = dragTargetPointerEvents;
            dragTarget.style.left = dragTargetOldOffsetX;
            dragTarget.style.top = dragTargetOldOffsetY;
            isDragging = false;
            droppingTarget = null;
            droppingOption = null;
            transferData = null;
          };
        };
      },
      unmounted: (el) => (el.onmousedown = null)
    });

    app.directive('steven-droppable', {
      mounted: function stevenDroppable(el, bindings) {
        if (!bindings.value) return console.warn('steven-droppable bindings are missing.');
        droppableRegister.set(el, bindings.value);
      },
      unmounted: (el) => droppableRegister.delete(el)
    });
  }
};
