<template>
  <div class="history">
    <h1 class="text-center text-4xl">歷史訂單</h1>
  </div>
  <table>
    <tr>
      <td>名稱</td>
      <td>售價</td>
      <td>數量</td>
      <td>打折</td>
      <td>折扣金額</td>
      <td>項目小節</td>
    </tr>
    <tr>
      <td>demo</td>
      <td>300</td>
      <td>2</td>
      <td>
        <div contenteditable="true">100</div>
      </td>
      <td>
        <div contenteditable="true" @keyup.enter.prevent>100</div>
      </td>
      <td>{{ 300 * 2 * 0.8 - 100 }}</td>
    </tr>
  </table>
</template>
