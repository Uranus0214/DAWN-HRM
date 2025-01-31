<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE-edge">

  <title>成績查詢結果</title>
  <link rel="shortcut icon" type="image/png" href="https://jmj.cmgsh.tp.edu.tw/jm_logo.png">
  <meta name='viewport' content="width=device-width,initial-scale=1">
  <!--link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.2.1/css/bootstrap.min.css' /-->
  <style> <?!= include('style.css'); ?> </style>
  <style> 
  th{
    background-color: <?= color ?>;
  }
  h1{
    color: <?= color ?>;
  }
  </style>
  <base target="_top">
</head>

<body>
  <div class="container mt-3">
    <div class="row">
      <div class="col-10 mx-auto text-center">
        <h1 class="text-primary">
          <?=page_title?>
        </h1>
        <h2> 查詢結果 </h2>

        <table class="table table-bordered table-striped table-hover">
          <thead>
            <? for (j of headers) { ?>
            <tr class="bg-primary text-white">
              <th scope="col">
                <?= title[j] ?>
              </th>
              <th scope="col" colspan="2">
                <?= value[j] ?>
              </th>
            </tr>
            <? } ?>

          </thead>
          <tbody>
            <? for (j of datas) { ?>
            <tr>
              <td scope="col">
                <?= title[j] ?>
              </td>
              <td scope="col" colspan="2">
                <?= value[j] ?>
              </td>
            </tr>
            <? } ?>


          </tbody>
          <tfoot>
            <tr>
              <td colspan="1" class="text-middle" style="vertical-align: middle;">
                <p class="mb-0">
                  <?= comment_name ?>
                </p>
              </td>

              <td colspan="2" class="text-middle">
                <pre class="mb-0"><?= comment_value ?></pre>
              </td>
            <tr>
          </tfoot>
        </table>
      </div>
    </div>
  </div>
</body>

</html>
