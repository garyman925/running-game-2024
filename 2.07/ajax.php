<?
	session_start();
	require '../../../include/dbauth.php';
	
	$member = $_SESSION["reading_id"];
	
	if($_POST['act'] == "save_record"){
		
		$domain_id =str_replace("'", "''", $_POST['article_id']);
		$score =str_replace("'", "''", $_POST['score']);
		$gcenter_id =str_replace("'", "''", $_POST['gcenter_id']);
		$limit =str_replace("'", "''", $_POST['lmt']);
		$game_id=14;
		
		if($limit==""){
			$limit=13;
		}
		
		// Insert User answer record
		$qIds = json_decode($_POST['q_ids']);
		$userAns = json_decode($_POST['u_ans']);
		
		foreach($userAns as $key => $value){
			$q_id = $qIds[$key];
			
			$sql = "select answer from new_game_question where q_id = '".$q_id."' ";
			$query = mysql_query ($sql);
			$result = mysql_fetch_array ($query);
			$sys_answer = $result[0];
			
			if( trim($value)==trim($sys_answer) ){
				$correctstatus=1;
			} else {
				$correctstatus=0;
			}
			
			$insert = "	INSERT INTO game_useranswer_record set 
							member_id='".$member."', 
							game_question_id='".$q_id."', 
							system_ans='".$sys_answer."', 
							user_ans='".$value."', 
							record_date=NOW(), 
							domain_id ='".$gcenter_id."', 
							correct_status ='".$correctstatus."', 
							game_id='".$game_id."' 
						";
			mysql_query($insert);
			
		}
		
			$score_total = round($score / $limit *100);
			if($score_total > 100)
				$score_total = 100;
			
			//$insert = "insert into game_center_markrecord set member_id='".$member."' , game_id='".$domain_id."' , domainname_id='".$gcenter_id."', 
						//marks='".$score_total."' , mark_date=NOW()";
			//mysql_query($insert);
			
			$qq="select gamemark_id, start_time from game_center_markrecord where member_id='".$member."' and game_id='".$domain_id."' and domainname_id='".$gcenter_id."' and completed=0 ";
			$ss=mysql_query($qq);
			$dd=mysql_fetch_array($ss);
			$gamemarkid=$dd['gamemark_id'];
			$starttime=$dd['start_time'];
			$finishtime = date("Y-m-d H:i:s");
			$time_used = strtotime($finishtime) - strtotime($starttime);
			
			$update_query=" update game_center_markrecord set marks='".$score_total."' , gametime='".$time_used."', mark_date='".$finishtime."', completed=1 
							where gamemark_id='".$gamemarkid."' ";
			mysql_query($update_query);
			
}
	
?>