
<?php
if(isset($_GET['name']))
{
     $q = $_GET['name'];
	
}else{
	$q = "";
}
?>
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<link rel="stylesheet" type="text/css" href="style.css">
	<title>thanhphong</title>
	
</head>
<body>
	<h1>
		<a href="https://www.facebook.com/thanhphong031201" class="hello">HELLO WORLD</a>
	</h1>
<h2>I'm Thanhphong</h2>
	<table border="2" cellpadding="0" cellspacing="0">
		<tr>
			<th>
				project
			</th>
			<th>
				#
			</th>
		</tr>
		<tr>
			<th>
				demo download video youtube
			</th>
			<th>
				<a href="https://thanhphong312.github.io/index.php?name=down">Chọn</a>
			</th>
		</tr>
		
	</table>
	<div id="main-content" name="main-content">
 		<?php
		switch($q)
		{
			case "down":
				require"./downvideoyotube/index.php";
				break;
			default :
				require"";
				break;
		}
		?>
	</div>
</body>
</html>
